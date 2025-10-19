import { ethers } from "ethers";
import { genmnemonic , getSeed } from "./mnemonic";

interface WalletInfo {
    publicKey : string;
    privateKey: string;
    chain     : "Ethereum";
    index     : number;
}


const createEthereumWallet = () => {
    const {seed} = genmnemonic();
    const Path = `m/44'/60'/0'/0/0`;
    const hdNOde = ethers.HDNodeWallet.fromSeed(seed)
    const wallet = hdNOde.derivePath(Path);
    const account: WalletInfo = {
        publicKey : wallet.address,
        privateKey: wallet.privateKey,
        chain     : "Ethereum",
        index     : 0
    };
    return account;
}

const generateEthereumWallet = ( mnemonic: string , index: number): WalletInfo => {
    const seed = getSeed(mnemonic)
    const Path = `m/44'/60'/${index}'/0'`;
    const hdNOde = ethers.HDNodeWallet.fromSeed(seed)
    const wallet = hdNOde.derivePath(Path);
    const account: WalletInfo = {
        publicKey : wallet.address,
        privateKey: wallet.privateKey,
        chain     : "Ethereum",
        index     : index
    };
    return account;
}

const addExistingEthereumWallet = (mnemonic: string , index?: number) => {
    const seed = getSeed(mnemonic);
    if (index === undefined) { index = 0; }
    const Path = `m/44'/60'/${index}'/0'`;
    const hdNOde = ethers.HDNodeWallet.fromSeed(seed)
    const wallet = hdNOde.derivePath(Path);
    const account: WalletInfo = {
        publicKey : wallet.address,
        privateKey: wallet.privateKey,
        chain     : "Ethereum",
        index     : index
    };
    return account;

}

const addAllExistingEthereumWallets = (mnemonic: string , count: number) => {
    const wallets: WalletInfo[] = [];
    for (let i = 0; i < count; i++) {
        const wallet = addExistingEthereumWallet(mnemonic , i);
        wallets.push(wallet);
    }
    return wallets;
}

export { generateEthereumWallet , addExistingEthereumWallet , addAllExistingEthereumWallets , createEthereumWallet };
export type { WalletInfo };
