import { ethers } from "ethers";
import { genmnemonic , getSeed } from "./mnemonic";
import { ACTIVE_ETH_RPC, ETH_PATH_PREFIX, MAX_TX_FETCH } from './networks';

interface ethereumWalletInfo {
    publicKey : string; // address
    privateKey: string; // hex priv key
    chain     : "Ethereum";
    index     : number;
}


const createEthereumWallet = () => {
    const { seed } = genmnemonic();
    const base = ethers.HDNodeWallet.fromSeed(seed);
    const wallet = base.derivePath(`${ETH_PATH_PREFIX}/0`);
    return {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        chain: 'Ethereum',
        index: 0
    };
};

const generateEthereumWallet = (mnemonic: string, index: number): ethereumWalletInfo => {
    const seed = getSeed(mnemonic);
    const root = ethers.HDNodeWallet.fromSeed(seed);
    const wallet = root.derivePath(`${ETH_PATH_PREFIX}/${index}`);
    return {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
        chain: 'Ethereum',
        index
    };
};

const addExistingEthereumWallet = (mnemonic: string, index: number = 0) => {
    return generateEthereumWallet(mnemonic, index);
};

const addAllExistingEthereumWallets = (mnemonic: string, count: number) => {
    const wallets: ethereumWalletInfo[] = [];
    for (let i = 0; i < count; i++) wallets.push(addExistingEthereumWallet(mnemonic, i));
    return wallets;
};

// Live network helpers
const getEthereumProvider = () => new ethers.JsonRpcProvider(ACTIVE_ETH_RPC);

const fetchEthereumBalance = async (address: string): Promise<string> => {
    const provider = getEthereumProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
};

// Basic log-based transaction fetch (incoming/outgoing transfers) using Transfer events is complex; we fallback to scanning recent blocks for simplicity.
const fetchEthereumTransactions = async (address: string): Promise<any[]> => {
    const provider = getEthereumProvider();
    const latest = await provider.getBlockNumber();
    const lowerBound = Math.max(0, latest - 2000); // scan last ~2000 blocks
    const addr = address.toLowerCase();
    const collected: any[] = [];
    for (let b = latest; b >= lowerBound && collected.length < MAX_TX_FETCH; b--) {
        const block: any = await provider.getBlock(b, true);
        if (!block?.transactions) continue;
        for (const txObj of block.transactions as any[]) {
            const fromAddr = (txObj.from || '').toLowerCase();
            const toAddr = (txObj.to || '').toLowerCase();
            if (fromAddr === addr || toAddr === addr) {
                collected.push({
                    hash: txObj.hash,
                    from: txObj.from,
                    to: txObj.to,
                    value: ethers.formatEther(txObj.value),
                    blockNumber: txObj.blockNumber,
                });
                if (collected.length >= MAX_TX_FETCH) break;
            }
        }
    }
    return collected;
};

const sendEthereumTransaction = async (privateKey: string, to: string, amountEth: string): Promise<string> => {
    const provider = getEthereumProvider();
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = await wallet.sendTransaction({ to, value: ethers.parseEther(amountEth) });
    await tx.wait();
    return tx.hash;
};

// Address validation
const isValidEthereumAddress = (address: string): boolean => {
    try { return ethers.isAddress(address); } catch { return false; }
};

export { generateEthereumWallet , addExistingEthereumWallet , addAllExistingEthereumWallets , createEthereumWallet, fetchEthereumBalance, fetchEthereumTransactions, sendEthereumTransaction, isValidEthereumAddress };
export type { ethereumWalletInfo };
