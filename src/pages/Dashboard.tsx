import { useState, useEffect } from 'react';
import WalletList from '../components/WalletList';
import TransactionList from '../components/TransactionList';
import SendForm from '../components/SendForm';
import ImportMnemonicModal from '../components/ImportMnemonicModal';
import { retriveEthereumWallets, retriveSolanaWallets, removeEthereumWallet, removeSolanaWallet } from '../helper/helper';
import { generateEthereumWallet, type ethereumWalletInfo, fetchEthereumBalance, fetchEthereumTransactions, sendEthereumTransaction } from '../utils/ethers';
import { generateSolanaWallet, type solanaWalletInfo, fetchSolanaBalance, fetchSolanaTransactions, sendSolanaTransaction } from '../utils/solana';
import { getData, storeData } from '../utils/localStore';
// Removed local transaction storage utilities (now using network fetch)

interface DashboardProps {
  currentChain: 'ethereum' | 'solana';
  onChainChange: (chain: 'ethereum' | 'solana') => void;
  onNotify: (title: string, message: string, details?: any) => void;
}

export default function Dashboard({ currentChain, onNotify }: DashboardProps) {
  const [ethereumWallets, setEthereumWallets] = useState<ethereumWalletInfo[]>([]);
  const [solanaWallets, setSolanaWallets] = useState<solanaWalletInfo[]>([]);
  const [transactions, setTransactions] = useState<{ ethereum: any[]; solana: any[] }>({
    ethereum: [],
    solana: [],
  });
  const [balances, setBalances] = useState<{ ethereum: Record<string,string>; solana: Record<string,string> }>({ ethereum: {}, solana: {} });
  // Removed manual AddWalletModal. Wallet creation now auto-increments index per chain.
  const [showImportMnemonic, setShowImportMnemonic] = useState(false);

  useEffect(() => {
    loadWallets();
  }, []);

  // Fetch balances/transactions once wallets are loaded (initial mount)
  useEffect(() => {
    if (ethereumWallets.length || solanaWallets.length) {
      refreshNetworkData();
    }
  }, []);

  // Refresh when wallets change (add/remove) or chain changes
  useEffect(() => {
    if (ethereumWallets.length || solanaWallets.length) {
      refreshNetworkData();
    }
  }, [ethereumWallets, solanaWallets, currentChain]);

  const loadWallets = () => {
    setEthereumWallets(retriveEthereumWallets());
    setSolanaWallets(retriveSolanaWallets());
  };

  const refreshNetworkData = async () => {
    if (ethereumWallets.length > 0) {
      const ethTx = [] as any[];
      for (const w of ethereumWallets) {
        // fetch balance per wallet
        const bal = await fetchEthereumBalance(w.publicKey);
        setBalances(prev => ({ ...prev, ethereum: { ...prev.ethereum, [w.publicKey]: bal } }));
        const txs = await fetchEthereumTransactions(w.publicKey);
        ethTx.push(...txs);
      }
      setTransactions(prev => ({ ...prev, ethereum: ethTx.slice(0, 50) }));
    }
    if (solanaWallets.length > 0) {
      const solTx = [] as any[];
      for (const w of solanaWallets) {
        const bal = await fetchSolanaBalance(w.publicKey);
        setBalances(prev => ({ ...prev, solana: { ...prev.solana, [w.publicKey]: bal } }));
        const txs = await fetchSolanaTransactions(w.publicKey);
        solTx.push(...txs);
      }
      setTransactions(prev => ({ ...prev, solana: solTx.slice(0, 50) }));
    }
  };

  const getNextIndexKey = (chain: 'ethereum' | 'solana') => chain === 'ethereum' ? 'ethereumNextIndex' : 'solanaNextIndex';

  const computeMaxIndex = (wallets: { index: number }[]) => {
    if (wallets.length === 0) return -1;
    return wallets.reduce((max, w) => w.index > max ? w.index : max, -1);
  };

  const handleAddWallet = () => {
    const mnemonic = getData('mnemonic');
    if (!mnemonic) {
      onNotify('Mnemonic Missing', 'No mnemonic found. Please import one first.');
      return;
    }

    try {
      const key = getNextIndexKey(currentChain);
      let nextIndexStr = getData(key);
      let nextIndex: number;
      if (nextIndexStr === null || nextIndexStr === undefined) {
        // initialize from existing wallets (max+1) or start at 0
        const existing = currentChain === 'ethereum' ? ethereumWallets : solanaWallets;
        nextIndex = computeMaxIndex(existing) + 1;
      } else {
        nextIndex = parseInt(nextIndexStr, 10);
        if (Number.isNaN(nextIndex)) nextIndex = 0;
      }

      if (currentChain === 'ethereum') {
        const wallet = generateEthereumWallet(mnemonic, nextIndex);
        const updated = [...ethereumWallets, wallet];
        setEthereumWallets(updated);
        storeData('ethereumWallets', JSON.stringify(updated));
      } else {
        const wallet = generateSolanaWallet(mnemonic, nextIndex);
        const updated = [...solanaWallets, wallet];
        setSolanaWallets(updated);
        storeData('solanaWallets', JSON.stringify(updated));
      }
      // refresh balances/tx for new wallet
      refreshNetworkData();

      // persist incremented next index
      storeData(key, String(nextIndex + 1));
      onNotify('Wallet Created', `Wallet #${nextIndex} created successfully`);
    } catch (error) {
      console.error('Error adding wallet:', error);
      onNotify('Wallet Error', 'Failed to add wallet', error);
    }
  };

  const handleImportMnemonic = (mnemonic: string) => {
    storeData('mnemonic', mnemonic);
    setShowImportMnemonic(false);
    onNotify('Mnemonic Imported', 'Mnemonic imported successfully');
  };

  const handleRemoveWallet = (address: string) => {
    if (currentChain === 'ethereum') {
      const wallet = ethereumWallets.find((w) => w.publicKey === address);
      if (wallet) {
        removeEthereumWallet(wallet);
        setEthereumWallets(retriveEthereumWallets());
      }
    } else {
      const wallet = solanaWallets.find((w) => w.publicKey === address);
      if (wallet) {
        removeSolanaWallet(wallet);
        setSolanaWallets(retriveSolanaWallets());
      }
    }
  };

  const handleSend = async (from: string, to: string, amount: string) => {
    try {
      let txId: string;
      if (currentChain === 'ethereum') {
        const wallet = ethereumWallets.find(w => w.publicKey === from);
        if (!wallet) throw new Error('Wallet not found');
        txId = await sendEthereumTransaction(wallet.privateKey, to, amount);
      } else {
        const wallet = solanaWallets.find(w => w.publicKey === from);
        if (!wallet) throw new Error('Wallet not found');
        txId = await sendSolanaTransaction(wallet.privateKey, to, amount);
      }
      onNotify('Transaction Sent', `Broadcasted transaction`, { id: txId, chain: currentChain });
      await refreshNetworkData();
    } catch (e:any) {
      console.error(e);
      // Try to extract insufficient funds details
      let friendly = e.message || 'error';
      if (/insufficient funds/i.test(friendly)) {
        friendly = 'Insufficient funds to cover value + gas. Please fund this wallet.';
      }
      onNotify('Send Failed', friendly, e);
    }
  };

  const currentWallets = currentChain === 'ethereum' ? ethereumWallets : solanaWallets;
  const currentTransactions = transactions[currentChain];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[340px_1fr_380px] gap-7">
          <WalletList
            chain={currentChain}
            wallets={currentWallets}
            balances={balances[currentChain]}
            onAddWallet={handleAddWallet}
            onImportMnemonic={() => setShowImportMnemonic(true)}
            onRemoveWallet={handleRemoveWallet}
          />

          <TransactionList 
            chain={currentChain} 
            transactions={currentTransactions as any} 
            onRefresh={refreshNetworkData} 
          />

          <SendForm 
            chain={currentChain} 
            wallets={currentWallets} 
            onSend={handleSend} 
            onNotify={onNotify}
          />
        </div>
      </div>

      {showImportMnemonic && (
        <ImportMnemonicModal
          onClose={() => setShowImportMnemonic(false)}
          onImport={handleImportMnemonic}
        />
      )}
    </div>
  );
}
