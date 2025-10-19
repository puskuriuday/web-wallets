import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { storeData } from "./localStore";


const genmnemonic = () => {
    const mnemonic = generateMnemonic();
    const seed = getSeed(mnemonic);
    storeData("mnemonic" , mnemonic);
    return { mnemonic, seed };
}

const getSeed = (mnemonic: string) => {
    return mnemonicToSeedSync(mnemonic);
}


export { genmnemonic , getSeed };