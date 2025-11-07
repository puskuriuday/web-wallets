// Network RPC endpoint configuration
// Use testnets for easier experimentation; switch to mainnet constants for production.

export const ETHEREUM_RPC = 'https://eth.llamarpc.com'; // Public mainnet JSON-RPC
export const ETHEREUM_SEPOLIA_RPC = 'https://sepolia.gateway.tenderly.co'; // Example testnet (may rate-limit)
export const SOLANA_MAINNET_RPC = 'https://api.mainnet-beta.solana.com';
export const SOLANA_DEVNET_RPC = 'https://api.devnet.solana.com';

// Active selection (choose testnets for funding ease)
export const ACTIVE_ETH_RPC = ETHEREUM_SEPOLIA_RPC; // switch to ETHEREUM_RPC for mainnet
export const ACTIVE_SOL_RPC = SOLANA_DEVNET_RPC;    // switch to SOLANA_MAINNET_RPC for mainnet

// Derivation path templates
export const ETH_PATH_PREFIX = "m/44'/60'/0'/0"; // Append /index
export const SOL_PATH_TEMPLATE = (index: number) => `m/44'/501'/${index}'/0'`; // Standard Solana (Ed25519)

export const MAX_TX_FETCH = 25;