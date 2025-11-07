import React from 'react';
import type { ethereumWalletInfo } from '../utils/ethers';
import type { solanaWalletInfo } from '../utils/solana';

interface WalletListProps {
  chain: 'ethereum' | 'solana';
  wallets: (ethereumWalletInfo | solanaWalletInfo)[];
  balances?: Record<string,string>; // address -> balance
  onAddWallet: () => void;
  onImportMnemonic: () => void;
  onRemoveWallet: (address: string) => void;
}

const WalletList: React.FC<WalletListProps> = ({
  chain,
  wallets,
  balances,
  onAddWallet,
  onImportMnemonic,
  onRemoveWallet,
}) => {
  return (
    <section className="p-6 rounded-2xl bg-gradient-to-br from-white/6 to-white/2 dark:from-white/6 dark:to-white/2 light:from-white light:to-white border border-white/8 dark:border-white/8 light:border-slate-200 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-radial before:from-sky-400/10 before:to-transparent before:pointer-events-none">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
          Wallets
        </h3>
        <div className="flex gap-2">
          <button 
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 light:from-slate-100 light:to-slate-200 text-slate-100 dark:text-slate-100 light:text-slate-900 border border-white/8 dark:border-white/8 light:border-slate-300 hover:shadow-lg hover:shadow-slate-500/10 transition-shadow"
            onClick={onAddWallet}
          >
            + Create
          </button>
          <button 
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-transparent text-slate-100 dark:text-slate-100 light:text-slate-900 border border-white/8 dark:border-white/8 light:border-slate-300 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-50 transition-colors"
            onClick={onImportMnemonic}
          >
            Import
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {wallets.length === 0 ? (
          <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
            No wallets yet. Add one.
          </div>
        ) : (
          wallets.map((wallet) => (
            <div 
              key={wallet.publicKey} 
              className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 light:from-slate-50 light:via-slate-100 light:to-slate-150 border border-white/8 dark:border-white/8 light:border-slate-200 flex flex-col gap-1.5 relative"
            >
              <div className="flex items-center justify-between gap-2.5">
                <span className="px-2.5 py-1 rounded-full text-[11px] bg-white/8 dark:bg-white/8 light:bg-slate-200 text-slate-400 dark:text-slate-400 light:text-slate-600 tracking-wide">
                  {chain}
                </span>
                <span className="text-base font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
                  {balances?.[wallet.publicKey] ?? '—'} {chain === 'ethereum' ? 'ETH' : 'SOL'}
                </span>
              </div>
              <div className="font-mono text-xs tracking-wide text-slate-400 dark:text-slate-400 light:text-slate-600 break-all">
                {wallet.publicKey}
              </div>
              <div className="flex items-center justify-between gap-2.5">
                <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
                  Index {wallet.index}
                </span>
                <button
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-transparent text-slate-100 dark:text-slate-100 light:text-slate-900 border border-white/8 dark:border-white/8 light:border-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
                  onClick={() => onRemoveWallet(wallet.publicKey)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default WalletList;
