// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * KindFlow (Monad / EVM)
 * - Minimal 2-contract design: KindToken + KindFlowCore
 * - All business logic on-chain in KindFlowCore
 * - Token is "internal-use": transfers are restricted to Core
 *
 * Notes:
 * - metadataCID / proofCID / evidenceCID are stored as strings (IPFS/Arweave CID)
 * - MVP-grade: no upgradability, no complex moderation, no oracle, no offchain signatures
 */

/*//////////////////////////////////////////////////////////////
                            KindToken
//////////////////////////////////////////////////////////////*/

contract KindToken {
    string public name = "KindToken";
    string public symbol = "KIND";
    uint8 public immutable decimals = 18;

    uint256 public totalSupply;

    address public owner;
    address public core; // KindFlowCore authorized to move/mint/burn

    mapping(address => uint256) public balanceOf;

    // Allowances intentionally not implemented (to reduce abuse surface)
    // All movement should go through KindFlowCore.

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event CoreChanged(address indexed oldCore, address indexed newCore);

    error NotOwner();
    error NotCore();
    error ZeroAddress();
    error InsufficientBalance();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyCore() {
        if (msg.sender != core) revert NotCore();
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnerChanged(address(0), msg.sender);
    }

    function setCore(address newCore) external onlyOwner {
        if (newCore == address(0)) revert ZeroAddress();
        emit CoreChanged(core, newCore);
        core = newCore;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    /// @notice Mint KIND to a user (only Core)
    function mint(address to, uint256 amount) external onlyCore {
        if (to == address(0)) revert ZeroAddress();
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    /// @notice Burn KIND from a user (only Core)
    function burn(address from, uint256 amount) external onlyCore {
        if (balanceOf[from] < amount) revert InsufficientBalance();
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    /// @notice Internal transfer for tips / payouts (only Core)
    function transferInternal(address from, address to, uint256 amount) external onlyCore {
        if (to == address(0)) revert ZeroAddress();
        if (balanceOf[from] < amount) revert InsufficientBalance();
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    // Intentionally NO external transfer() to prevent "withdrawal-like" movement.
}

/*//////////////////////////////////////////////////////////////
                          KindFlowCore
//////////////////////////////////////////////////////////////*/

contract KindFlowCore {
    /*//////////////////////
            Types
    //////////////////////*/

    enum TaskStatus {
        NONE,
        OPEN,
        IN_PROGRESS,
        COMPLETED_PENDING_REVIEW,
        APPROVED,
        REJECTED,
        CANCELLED
    }

    enum EventStatus {
        NONE,
        OPEN,
        IN_PROGRESS,
        RESOLVED,
        FAILED,
        CLOSED
    }

    enum ActionType {
        USER_REGISTERED,
        TASK_CREATED,
        TASK_ACCEPTED,
        TASK_PROOF_SUBMITTED,
        TASK_CONFIRMED_APPROVED,
        TASK_CONFIRMED_REJECTED,
        TIP,
        EVENT_CREATED,
        EVENT_FOLLOWED,
        EVENT_ACTION_SUBMITTED,
        EVENT_STATUS_UPDATED,
        ORG_REGISTERED,
        ORG_MEMBERSHIP_PAID
    }

    struct User {
        bool registered;
        uint64 reputation;        // simple integer score
        uint64 totalGoodActions;  // total actions recorded
    }

    struct Task {
        uint256 taskId;
        address creator;
        address helper;
        uint256 reward;           // KIND locked as reward (escrowed in Core accounting)
        string metadataCID;       // task details
        string proofCID;          // completion proof
        TaskStatus status;
        uint40 createdAt;
        uint40 updatedAt;
    }

    struct BadEvent {
        uint256 eventId;
        address creator;
        uint256 stake;            // KIND paid to publish (can be burned or kept by protocol)
        string metadataCID;       // structured event info
        EventStatus status;
        uint40 createdAt;
        uint40 updatedAt;
    }

    struct ActionRecord {
        address actor;
        ActionType actionType;
        uint256 targetId;         // taskId or eventId (0 if none)
        uint40 timestamp;
        uint64 weight;            // how much reputation gained
        string dataCID;           // optional: proof/evidence CID pointer
    }

    struct Organization {
        bool registered;
        uint40 membershipUntil;   // unix timestamp
        string metadataCID;
    }

    /*//////////////////////
         Immutables/State
    //////////////////////*/

    KindToken public immutable token;
    address public owner;
    address public operator; // optional moderator/operator (can be owner)

    uint256 public nextTaskId = 1;
    uint256 public nextEventId = 1;
    uint256 public nextActionId = 1;

    mapping(address => User) public users;
    mapping(uint256 => Task) public tasks;
    mapping(uint256 => BadEvent) public eventsById;

    // followers: eventId => (user => bool)
    mapping(uint256 => mapping(address => bool)) public isFollowing;

    // action log (append-only)
    mapping(uint256 => ActionRecord) public actions;

    // organizations
    mapping(address => Organization) public organizations;

    // Minimal economics knobs (can be tuned by owner)
    uint256 public followEventCost = 1e18;        // 1 KIND default
    uint256 public membershipFeePer30Days = 100e18; // 100 KIND / 30 days
    uint64  public repPerFollow = 1;
    uint64  public repPerTaskCreate = 1;
    uint64  public repPerTaskApproveHelper = 5;
    uint64  public repPerEventAction = 3;

    // Proof-of-work style anti-spam is out-of-scope; we rely on token costs + operator actions.

    /*//////////////////////
            Events
    //////////////////////*/

    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event OperatorChanged(address indexed oldOperator, address indexed newOperator);

    event UserRegistered(address indexed user);
    event TaskCreated(uint256 indexed taskId, address indexed creator, uint256 reward, string metadataCID);
    event TaskAccepted(uint256 indexed taskId, address indexed helper);
    event TaskProofSubmitted(uint256 indexed taskId, address indexed helper, string proofCID);
    event TaskConfirmed(uint256 indexed taskId, bool approved);

    event UserTipped(address indexed from, address indexed to, uint256 amount);

    event EventCreated(uint256 indexed eventId, address indexed creator, uint256 stake, string metadataCID);
    event EventFollowed(uint256 indexed eventId, address indexed follower);
    event EventActionSubmitted(uint256 indexed eventId, address indexed actor, string evidenceCID);
    event EventStatusUpdated(uint256 indexed eventId, EventStatus newStatus);

    event OrganizationRegistered(address indexed org, string metadataCID);
    event MembershipPaid(address indexed org, uint256 periods30Days, uint40 membershipUntil);

    /*//////////////////////
            Errors
    //////////////////////*/

    error NotOwner();
    error NotOperator();
    error NotRegistered();
    error AlreadyRegistered();
    error ZeroAddress();

    error InvalidTask();
    error InvalidEvent();
    error InvalidStatus();
    error NotCreator();
    error NotHelper();
    error AlreadyAccepted();
    error AlreadyFollowing();

    error BadInput();

    /*//////////////////////
            Modifiers
    //////////////////////*/

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyOperator() {
        if (msg.sender != operator && msg.sender != owner) revert NotOperator();
        _;
    }

    modifier onlyRegistered() {
        if (!users[msg.sender].registered) revert NotRegistered();
        _;
    }

    constructor(address tokenAddress) {
        if (tokenAddress == address(0)) revert ZeroAddress();
        token = KindToken(tokenAddress);
        owner = msg.sender;
        operator = msg.sender;

        emit OwnerChanged(address(0), msg.sender);
        emit OperatorChanged(address(0), msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                             Admin
    //////////////////////////////////////////////////////////////*/

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    function setOperator(address newOperator) external onlyOwner {
        if (newOperator == address(0)) revert ZeroAddress();
        emit OperatorChanged(operator, newOperator);
        operator = newOperator;
    }

    function setEconomics(
        uint256 _followEventCost,
        uint256 _membershipFeePer30Days,
        uint64 _repPerFollow,
        uint64 _repPerTaskCreate,
        uint64 _repPerTaskApproveHelper,
        uint64 _repPerEventAction
    ) external onlyOwner {
        followEventCost = _followEventCost;
        membershipFeePer30Days = _membershipFeePer30Days;
        repPerFollow = _repPerFollow;
        repPerTaskCreate = _repPerTaskCreate;
        repPerTaskApproveHelper = _repPerTaskApproveHelper;
        repPerEventAction = _repPerEventAction;
    }

    /*//////////////////////////////////////////////////////////////
                         User / Organization
    //////////////////////////////////////////////////////////////*/

    function registerUser() external {
        if (users[msg.sender].registered) revert AlreadyRegistered();
        users[msg.sender] = User({registered: true, reputation: 0, totalGoodActions: 0});
        _recordAction(msg.sender, ActionType.USER_REGISTERED, 0, 1, "");
        emit UserRegistered(msg.sender);
    }

    function registerOrganization(string calldata metadataCID) external {
        // org can also be a user; no conflict
        Organization storage org = organizations[msg.sender];
        if (org.registered) revert AlreadyRegistered();
        org.registered = true;
        org.metadataCID = metadataCID;
        org.membershipUntil = 0;

        _recordAction(msg.sender, ActionType.ORG_REGISTERED, 0, 1, metadataCID);
        emit OrganizationRegistered(msg.sender, metadataCID);
    }

    function payMembership(uint256 periods30Days) external {
        // minimal: only registered orgs pay
        Organization storage org = organizations[msg.sender];
        if (!org.registered) revert NotRegistered(); // reuse error; means "org not registered" here

        if (periods30Days == 0) revert BadInput();

        uint256 cost = membershipFeePer30Days * periods30Days;

        // burn membership fee (you could also keep it in Core by internal transfer to treasury)
        token.burn(msg.sender, cost);

        uint40 nowTs = uint40(block.timestamp);
        uint40 addSeconds = uint40(periods30Days * 30 days);

        uint40 base = org.membershipUntil > nowTs ? org.membershipUntil : nowTs;
        org.membershipUntil = base + addSeconds;

        _recordAction(msg.sender, ActionType.ORG_MEMBERSHIP_PAID, periods30Days, 1, "");
        emit MembershipPaid(msg.sender, periods30Days, org.membershipUntil);
    }

    function isOrgActive(address orgAddr) external view returns (bool) {
        Organization storage org = organizations[orgAddr];
        return org.registered && org.membershipUntil >= uint40(block.timestamp);
    }

    /*//////////////////////////////////////////////////////////////
                               Tasks
    //////////////////////////////////////////////////////////////*/

    function createTask(uint256 reward, string calldata metadataCID) external onlyRegistered returns (uint256 taskId) {
        if (reward == 0) revert BadInput();

        // lock reward by burning from creator now, and minting to helper on approval
        // Alternative: escrow inside Core via transferInternal to Core treasury; but token has no external transfer.
        token.burn(msg.sender, reward);

        taskId = nextTaskId++;
        tasks[taskId] = Task({
            taskId: taskId,
            creator: msg.sender,
            helper: address(0),
            reward: reward,
            metadataCID: metadataCID,
            proofCID: "",
            status: TaskStatus.OPEN,
            createdAt: uint40(block.timestamp),
            updatedAt: uint40(block.timestamp)
        });

        _recordAction(msg.sender, ActionType.TASK_CREATED, taskId, repPerTaskCreate, metadataCID);
        emit TaskCreated(taskId, msg.sender, reward, metadataCID);
    }

    function acceptTask(uint256 taskId) external onlyRegistered {
        Task storage t = tasks[taskId];
        if (t.status != TaskStatus.OPEN) revert InvalidStatus();
        if (t.creator == address(0)) revert InvalidTask();
        if (t.helper != address(0)) revert AlreadyAccepted();
        if (t.creator == msg.sender) revert BadInput();

        t.helper = msg.sender;
        t.status = TaskStatus.IN_PROGRESS;
        t.updatedAt = uint40(block.timestamp);

        _recordAction(msg.sender, ActionType.TASK_ACCEPTED, taskId, 1, "");
        emit TaskAccepted(taskId, msg.sender);
    }

    function submitTaskProof(uint256 taskId, string calldata proofCID) external onlyRegistered {
        Task storage t = tasks[taskId];
        if (t.creator == address(0)) revert InvalidTask();
        if (t.helper != msg.sender) revert NotHelper();
        if (t.status != TaskStatus.IN_PROGRESS) revert InvalidStatus();

        t.proofCID = proofCID;
        t.status = TaskStatus.COMPLETED_PENDING_REVIEW;
        t.updatedAt = uint40(block.timestamp);

        _recordAction(msg.sender, ActionType.TASK_PROOF_SUBMITTED, taskId, 1, proofCID);
        emit TaskProofSubmitted(taskId, msg.sender, proofCID);
    }

    /// @notice Confirm task completion; creator OR operator can approve/reject
    function confirmTask(uint256 taskId, bool approved) external {
        Task storage t = tasks[taskId];
        if (t.creator == address(0)) revert InvalidTask();
        if (t.status != TaskStatus.COMPLETED_PENDING_REVIEW) revert InvalidStatus();
        if (msg.sender != t.creator && msg.sender != operator && msg.sender != owner) revert NotOperator();

        t.updatedAt = uint40(block.timestamp);

        if (approved) {
            t.status = TaskStatus.APPROVED;
            // reward helper by minting equal amount back into supply (since we burned on create)
            token.mint(t.helper, t.reward);

            _recordAction(msg.sender, ActionType.TASK_CONFIRMED_APPROVED, taskId, 1, "");
            _gainReputation(t.helper, repPerTaskApproveHelper);
        } else {
            t.status = TaskStatus.REJECTED;
            // refund creator by minting back
            token.mint(t.creator, t.reward);

            _recordAction(msg.sender, ActionType.TASK_CONFIRMED_REJECTED, taskId, 1, "");
        }

        emit TaskConfirmed(taskId, approved);
    }

    /// @notice Optional: creator can cancel before accepted (refund)
    function cancelTask(uint256 taskId) external {
        Task storage t = tasks[taskId];
        if (t.creator == address(0)) revert InvalidTask();
        if (msg.sender != t.creator) revert NotCreator();
        if (t.status != TaskStatus.OPEN) revert InvalidStatus();

        t.status = TaskStatus.CANCELLED;
        t.updatedAt = uint40(block.timestamp);

        token.mint(t.creator, t.reward);
        // no action type for cancel in MVP to keep enums minimal, but you can add if you want.
    }

    /*//////////////////////////////////////////////////////////////
                               Tips
    //////////////////////////////////////////////////////////////*/

    function tipUser(address to, uint256 amount) external onlyRegistered {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert BadInput();
        token.transferInternal(msg.sender, to, amount);

        _recordAction(msg.sender, ActionType.TIP, uint256(uint160(to)), 1, "");
        emit UserTipped(msg.sender, to, amount);
    }

    /*//////////////////////////////////////////////////////////////
                               Events
    //////////////////////////////////////////////////////////////*/

    function createEvent(uint256 stake, string calldata metadataCID) external onlyRegistered returns (uint256 eventId) {
        if (stake == 0) revert BadInput();

        // burn stake for anti-spam (or you can redirect to treasury logic later)
        token.burn(msg.sender, stake);

        eventId = nextEventId++;
        eventsById[eventId] = BadEvent({
            eventId: eventId,
            creator: msg.sender,
            stake: stake,
            metadataCID: metadataCID,
            status: EventStatus.OPEN,
            createdAt: uint40(block.timestamp),
            updatedAt: uint40(block.timestamp)
        });

        _recordAction(msg.sender, ActionType.EVENT_CREATED, eventId, 1, metadataCID);
        emit EventCreated(eventId, msg.sender, stake, metadataCID);
    }

    function followEvent(uint256 eventId) external onlyRegistered {
        BadEvent storage e = eventsById[eventId];
        if (e.creator == address(0)) revert InvalidEvent();
        if (isFollowing[eventId][msg.sender]) revert AlreadyFollowing();

        // small cost to prevent spam-follow
        if (followEventCost > 0) token.burn(msg.sender, followEventCost);

        isFollowing[eventId][msg.sender] = true;

        _recordAction(msg.sender, ActionType.EVENT_FOLLOWED, eventId, repPerFollow, "");
        emit EventFollowed(eventId, msg.sender);
    }

    function submitEventAction(uint256 eventId, string calldata evidenceCID) external onlyRegistered {
        BadEvent storage e = eventsById[eventId];
        if (e.creator == address(0)) revert InvalidEvent();
        if (e.status == EventStatus.CLOSED) revert InvalidStatus();

        // Reward contributor (MVP: fixed rep + fixed token mint)
        // Token reward value can be tuned; keep small to avoid farming.
        uint256 reward = 2e18; // 2 KIND default reward (tunable by updating code; MVP constant)
        token.mint(msg.sender, reward);

        _recordAction(msg.sender, ActionType.EVENT_ACTION_SUBMITTED, eventId, repPerEventAction, evidenceCID);
        emit EventActionSubmitted(eventId, msg.sender, evidenceCID);
    }

    /// @notice Only operator can update event status (moderation/verification)
    function updateEventStatus(uint256 eventId, EventStatus newStatus) external onlyOperator {
        BadEvent storage e = eventsById[eventId];
        if (e.creator == address(0)) revert InvalidEvent();
        if (newStatus == EventStatus.NONE) revert BadInput();

        e.status = newStatus;
        e.updatedAt = uint40(block.timestamp);

        _recordAction(msg.sender, ActionType.EVENT_STATUS_UPDATED, eventId, 1, "");
        emit EventStatusUpdated(eventId, newStatus);
    }

    /*//////////////////////////////////////////////////////////////
                           Action / Reputation
    //////////////////////////////////////////////////////////////*/

    function getAction(uint256 actionId) external view returns (ActionRecord memory) {
        return actions[actionId];
    }

    function _gainReputation(address user, uint64 amount) internal {
        User storage u = users[user];
        if (!u.registered) return;
        unchecked {
            u.reputation += amount;
            u.totalGoodActions += 1;
        }
    }

    function _recordAction(
        address actor,
        ActionType actionType,
        uint256 targetId,
        uint64 weight,
        string memory dataCID
    ) internal {
        // Ensure actor exists: for org-only calls we still record even if not registered user,
        // but your product says personal users exist; keep strict for clarity
        // If you want org without user registration, you can relax this.
        if (!users[actor].registered && !organizations[actor].registered) {
            // allow recording for org registration itself (actor not org yet) only for ORG_REGISTERED
            if (actionType != ActionType.ORG_REGISTERED) {
                // for MVP, silently do nothing; or revert.
                // We'll revert to keep consistency.
                revert NotRegistered();
            }
        }

        uint256 id = nextActionId++;
        actions[id] = ActionRecord({
            actor: actor,
            actionType: actionType,
            targetId: targetId,
            timestamp: uint40(block.timestamp),
            weight: weight,
            dataCID: dataCID
        });

        // user stat updates (if actor is a user)
        if (users[actor].registered) {
            unchecked {
                users[actor].totalGoodActions += 1;
                users[actor].reputation += weight;
            }
        }
    }
}
