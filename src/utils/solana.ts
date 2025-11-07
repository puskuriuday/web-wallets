import { Keypair, Connection, SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import * as bip39 from 'bip39';
import { genmnemonic } from "./mnemonic";
import { ACTIVE_SOL_RPC, MAX_TX_FETCH } from './networks';
import { hmac } from '@noble/hashes/hmac';
import { sha512 } from '@noble/hashes/sha512';

interface solanaWalletInfo {
    publicKey : string;      // base58
    privateKey: string;      // base64 secretKey for reuse
    chain     : "Solana";
    index     : number;
}

// SLIP-0010 master key derivation for Ed25519
const slip10Master = (seed: Buffer) => {
    const I = hmac(sha512, Buffer.from('ed25519 seed'), seed);
    const IL = I.slice(0,32);
    const IR = I.slice(32);
    return { key: IL, chainCode: IR };
};

// Hardened child key derivation per SLIP-0010 (all components hardened for Ed25519)
const slip10Child = (parentKey: Uint8Array, parentChain: Uint8Array, index: number) => {
    // Hardened index = index + 0x80000000
    const idx = index + 0x80000000;
    const data = Buffer.concat([
        Buffer.from([0x00]),
        Buffer.from(parentKey),
        Buffer.from([(idx >> 24) & 0xff, (idx >> 16) & 0xff, (idx >> 8) & 0xff, idx & 0xff])
    ]);
    const I = hmac(sha512, parentChain, data);
    return { key: I.slice(0,32), chainCode: I.slice(32) };
};

// Derive path m/44'/501'/index'/0' (all hardened segments)
const deriveSolanaSeed = (seed: Buffer, index: number) => {
    // segments: 44', 501', index', 0'
    let node = slip10Master(seed);
    const segments = [44, 501, index, 0];
    for (const seg of segments) {
        node = slip10Child(node.key, node.chainCode, seg);
    }
    return node.key; // 32 bytes
};

const createSolanaWallet = (): solanaWalletInfo => {
    const { seed } = genmnemonic();
    const derived = deriveSolanaSeed(seed as Buffer, 0);
    const priv = Buffer.from(derived);
    const kp = Keypair.fromSeed(priv);
    return {
        publicKey: kp.publicKey.toBase58(),
        privateKey: Buffer.from(kp.secretKey).toString('base64'),
        chain: 'Solana',
        index: 0
    };
};

const generateSolanaWallet = (mnemonic: string, index: number): solanaWalletInfo => {
    const seed = bip39.mnemonicToSeedSync(mnemonic); // Buffer
    const derived = deriveSolanaSeed(seed as Buffer, index);
    const kp = Keypair.fromSeed(Buffer.from(derived));
    return {
        publicKey: kp.publicKey.toBase58(),
        privateKey: Buffer.from(kp.secretKey).toString('base64'),
        chain: 'Solana',
        index
    };
};

const addExistingSolanaWallet = (mnemonic: string , index: number = 0) => generateSolanaWallet(mnemonic, index);

const addAllExistingSolanaWallets = (mnemonic: string , count: number) => {
    const wallets: solanaWalletInfo[] = [];
    for (let i = 0; i < count; i++) wallets.push(addExistingSolanaWallet(mnemonic, i));
    return wallets;
};

// Network helpers
const getSolanaConnection = () => new Connection(ACTIVE_SOL_RPC);

const fetchSolanaBalance = async (address: string): Promise<string> => {
    const conn = getSolanaConnection();
    const lamports = await conn.getBalance(new PublicKey(address));
    return (lamports / LAMPORTS_PER_SOL).toFixed(6);
};

const fetchSolanaTransactions = async (address: string): Promise<any[]> => {
    const conn = getSolanaConnection();
    const pub = new PublicKey(address);
    const sigs = await conn.getSignaturesForAddress(pub, { limit: MAX_TX_FETCH });
    const out: any[] = [];
    for (const s of sigs) {
        out.push({ signature: s.signature, slot: s.slot, err: s.err, blockTime: s.blockTime });
    }
    return out;
};

const sendSolanaTransaction = async (privateKeyB64: string, to: string, amountSol: string): Promise<string> => {
    const conn = getSolanaConnection();
    const secret = Buffer.from(privateKeyB64, 'base64');
    const kp = Keypair.fromSecretKey(secret);
    const tx = new Transaction().add(SystemProgram.transfer({
        fromPubkey: kp.publicKey,
        toPubkey: new PublicKey(to),
        lamports: Math.floor(parseFloat(amountSol) * LAMPORTS_PER_SOL)
    }));
    const sig = await conn.sendTransaction(tx, [kp]);
    await conn.confirmTransaction(sig, 'confirmed');
    return sig;
};

const isValidSolanaAddress = (address: string): boolean => {
    try {
        new PublicKey(address);
        return true;
    } catch {
        return false;
    }
};

export { createSolanaWallet , generateSolanaWallet , addExistingSolanaWallet , addAllExistingSolanaWallets, fetchSolanaBalance, fetchSolanaTransactions, sendSolanaTransaction, isValidSolanaAddress };
export type { solanaWalletInfo };