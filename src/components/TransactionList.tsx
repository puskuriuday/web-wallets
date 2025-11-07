import React, { useState } from 'react';

interface Transaction {
  hash: string;
  amount: string;
  from: string;
  to: string;
  status: 'success' | 'fail' | 'pending';
  time: number;
}

interface TransactionListProps {
  chain: 'ethereum' | 'solana';
  transactions: Transaction[];
  onRefresh: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ chain, transactions, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTx = transactions.filter(
    (tx) =>
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="p-6 rounded-2xl bg-gradient-to-br from-white/6 to-white/2 dark:from-white/6 dark:to-white/2 light:from-white light:to-white border border-white/8 dark:border-white/8 light:border-slate-200 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-radial before:from-sky-400/10 before:to-transparent before:pointer-events-none md:col-span-2 lg:col-span-1">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
          Transactions
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search address..."
            className="bg-white/5 dark:bg-white/5 light:bg-slate-50 border border-white/8 dark:border-white/8 light:border-slate-300 px-3 py-2 rounded-xl text-slate-100 dark:text-slate-100 light:text-slate-900 text-xs w-44 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-transparent text-slate-100 dark:text-slate-100 light:text-slate-900 border border-white/8 dark:border-white/8 light:border-slate-300 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-50 transition-colors"
            onClick={onRefresh}
          >
            Refresh
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 max-h-[520px] overflow-auto scrollbar-thin">
        {filteredTx.length === 0 ? (
          <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
            {searchQuery ? 'No matches.' : 'No transactions loaded.'}
          </div>
        ) : (
          filteredTx.map((tx) => (
            <div 
              key={tx.hash} 
              className="p-3 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-50 border border-white/8 dark:border-white/8 light:border-slate-200 grid grid-cols-[1fr_auto] gap-2 text-xs"
            >
              <div className="font-mono break-all text-slate-100 dark:text-slate-100 light:text-slate-900">
                {tx.hash.slice(0, 42)}...
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-slate-100 dark:text-slate-100 light:text-slate-900">
                  {tx.amount} {chain === 'ethereum' ? 'ETH' : 'SOL'}
                </span>
                <span
                  className={tx.status === 'success' ? 'text-green-500' : 'text-red-500'}
                >
                  {tx.status}
                </span>
              </div>
              <div className="col-span-2 text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600">
                From {tx.from.slice(0, 12)}... → {tx.to.slice(0, 12)}...
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default TransactionList;
export type { Transaction };
