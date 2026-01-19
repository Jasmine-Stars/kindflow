// 如果用ethers v6（推荐）
import { ethers } from "ethers";
import KindTokenABI from "@/abi/KindToken.json";
import KindFlowCoreABI from "@/abi/KindFlowCore.json";
import { CONTRACT_ADDRESSES } from "./addresses";

export function getContracts(provider: ethers.BrowserProvider, chainId: number) {
  const addresses = CONTRACT_ADDRESSES[chainId];
  if (!addresses) throw new Error("Unsupported network");

  const signer = provider.getSigner();

  return {
    kindToken: new ethers.Contract(
      addresses.KindToken,
      KindTokenABI,
      signer
    ),
    kindFlow: new ethers.Contract(
      addresses.KindFlowCore,
      KindFlowCoreABI,
      signer
    ),
  };
}
