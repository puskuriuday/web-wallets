import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"
import { genmnemonic, getSeed } from "./mnemonic";

interface solanaWalletInfo {
    publicKey : string;
    privateKey: string;
    chain     : "Solana";
    index     : number;
}

const createSolanaWallet = (): solanaWalletInfo => {
    const { seed } = genmnemonic()
    const path = `m/44'/501'/0'/0'`;
    // const keypair = Keypair.fromSeed(derivedSeed);
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    const account: solanaWalletInfo = {
        publicKey : keypair.publicKey.toBase58(),
        privateKey: Buffer.from(secret).toString("hex"),
        chain     : "Solana",
        index     : 0
    };
    return account;
}

const generateSolanaWallet = (mnemonic: string , index: number): solanaWalletInfo => {
    const seed = getSeed(mnemonic);
    const path = `m/44'/501'/${index}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    const account: solanaWalletInfo = {
        publicKey : keypair.publicKey.toBase58(),
        privateKey: Buffer.from(secret).toString("hex"),
        chain     : "Solana",
        index     : index
    };
    return account;
}   

const addExistingSolanaWallet = (mnemonic: string , index?: number) => {
    const seed = getSeed(mnemonic);
    if (index === undefined) { index = 0; }
    const path = `m/44'/501'/${index}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);

    const account: solanaWalletInfo = {
        publicKey : keypair.publicKey.toBase58(),
        privateKey: Buffer.from(secret).toString("hex"),
        chain     : "Solana",
        index     : index
    };
    return account;
}

const addAllExistingSolanaWallets = (mnemonic: string , count: number) => {
    const wallets: solanaWalletInfo[] = [];
    for (let i = 0; i < count; i++) {
        const wallet = addExistingSolanaWallet(mnemonic , i);
        wallets.push(wallet);
    }
    return wallets;
}

export { createSolanaWallet , generateSolanaWallet , addExistingSolanaWallet , addAllExistingSolanaWallets };

export type { solanaWalletInfo };