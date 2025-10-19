import { generateMnemonic, mnemonicToSeedSync } from "bip39";



const genmnemonic = () => {
    const mnemonic = generateMnemonic();
    const seed = mnemonicToSeedSync(mnemonic);
    localStorage.setItem("mnemonic", mnemonic);
    return { mnemonic, seed };
}

export { genmnemonic };