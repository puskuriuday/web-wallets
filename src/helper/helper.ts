import type { ethereumWalletInfo } from "../utils/ethers";
import { getData, removeData, storeData } from "../utils/localStore"
import type { solanaWalletInfo } from "../utils/solana";



const checkLoginStatus = () => {
    const status = getData('isLoggedIn');
    if (status == undefined || status == null || status == 'false') {
        return false
    }
    return true;
}

const login = ( password: string ) => {
    storeData("Password", password);
    storeData('isLoggedIn' , 'true');
    return true;
}

const logout = () => {
    removeData('isLoggedIn');
}

const retriveEthereumWallets = (): ethereumWalletInfo[]  => {
    const walletsData = getData('ethereumWallets');
    if (walletsData == undefined || walletsData == null) {
        return new Array<ethereumWalletInfo>();
    }
    try {
        const wallets: ethereumWalletInfo[] = JSON.parse(walletsData);
        return wallets;
    } catch (error) {
        console.error("Error parsing wallets data: ", error);
        return new Array<ethereumWalletInfo>();;
    }
}

const retriveSolanaWallets = (): solanaWalletInfo[]  => {
    const walletsData = getData('solanaWallets');
    if (walletsData == undefined || walletsData == null) {
        return new Array<solanaWalletInfo>();
    }
    try {
        const wallets: solanaWalletInfo[] = JSON.parse(walletsData);
        return wallets;
    } catch (error) {
        console.error("Error parsing wallets data: ", error);
        return new Array<solanaWalletInfo>();;
    }
}

const removeEthereumWallet = (data: ethereumWalletInfo ) => {
    const publicKey = data.publicKey;
    let wallets = retriveEthereumWallets();
    const updatedWallets = wallets.filter(wallet => wallet.publicKey !== publicKey);
    storeData('ethereumWallets' , JSON.stringify(updatedWallets));
}

const removeSolanaWallet = (data: solanaWalletInfo ) => {
    const publicKey = data.publicKey;
    let wallets = retriveSolanaWallets();
    const updatedWallets = wallets.filter(wallet => wallet.publicKey !== publicKey);
    storeData('solanaWallets' , JSON.stringify(updatedWallets));
}

export { checkLoginStatus , retriveEthereumWallets , retriveSolanaWallets , login ,logout , removeEthereumWallet , removeSolanaWallet };