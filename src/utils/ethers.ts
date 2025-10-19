import { ethers } from "ethers";
import { genmnemonic } from "./mnemonic";

interface WalletInfo {
    publicKey : string;
    privateKey: string;
    chain     : "Ethereum";
    index     : number;
}

const generateEthereumWallet = (index: number): WalletInfo => {
    const { seed} = genmnemonic();
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

export { generateEthereumWallet };
export type { WalletInfo };
