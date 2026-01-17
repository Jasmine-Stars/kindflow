import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Monad Testnet chain configuration
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
  testnet: true,
} as const;

export const config = createConfig({
  chains: [monadTestnet, mainnet, sepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [monadTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Contract addresses (to be updated after deployment)
export const CONTRACTS = {
  KINDCOIN: '0x0000000000000000000000000000000000000000', // Update after deployment
  TASK_MANAGER: '0x0000000000000000000000000000000000000000', // Update after deployment
  EVENT_TRACKER: '0x0000000000000000000000000000000000000000', // Update after deployment
} as const;
