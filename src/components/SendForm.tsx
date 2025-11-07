import React, { useState } from 'react';
import type { ethereumWalletInfo } from '../utils/ethers';
import type { solanaWalletInfo } from '../utils/solana';

interface SendFormProps {
  chain: 'ethereum' | 'solana';
  wallets: (ethereumWalletInfo | solanaWalletInfo)[];
  onSend: (from: string, to: string, amount: string) => void;
  onNotify?: (title: string, message: string, details?: any) => void;
}

import { isValidEthereumAddress } from '../utils/ethers';
import { isValidSolanaAddress } from '../utils/solana';

const SendForm: React.FC<SendFormProps> = ({ chain, wallets, onSend, onNotify }) => {
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const feeEstimate = chain === 'ethereum' ? '≈ 0.00021 ETH' : '≈ 0.000005 SOL';

  const validateAddress = (addr: string): boolean => {
    if (chain === 'ethereum') return isValidEthereumAddress(addr);
    return isValidSolanaAddress(addr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAddress) {
      setStatus('Please select a wallet');
      return;
    }
    if (!toAddress) {
      setStatus('Please enter destination address');
      return;
    }
    if (!validateAddress(toAddress)) {
      const msg = 'Invalid destination address for ' + chain;
      setStatus(msg);
      onNotify?.('Invalid Address', msg, { to: toAddress, chain });
      return;
    }
    if (toAddress === fromAddress) {
      const msg = 'Destination cannot be same as source';
      setStatus(msg);
      onNotify?.('Address Conflict', msg);
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setStatus('Please enter valid amount');
      return;
    }

    onSend(fromAddress, toAddress, amount);
    setStatus('Transaction submitted (demo).');
    setToAddress('');
    setAmount('');
  };

  const invalidAddress = toAddress.length > 0 && !validateAddress(toAddress);

  return (
    <section className="p-6 rounded-2xl bg-gradient-to-br from-white/6 to-white/2 dark:from-white/6 dark:to-white/2 light:from-white light:to-white border border-white/8 dark:border-white/8 light:border-slate-200 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-radial before:from-sky-400/10 before:to-transparent before:pointer-events-none md:col-span-2 lg:col-span-1">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
          Send
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1.5 text-sm w-full">
          <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium tracking-wide">
            From Wallet
          </span>
          <select 
            value={fromAddress} 
            onChange={(e) => setFromAddress(e.target.value)} 
            required
            className="bg-slate-800/65 dark:bg-slate-800/65 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-100 dark:text-slate-100 light:text-slate-900 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            <option value="">Select wallet</option>
            {wallets.map((w) => (
              <option key={w.publicKey} value={w.publicKey}>
                {w.publicKey.slice(0, 8)}...
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm w-full">
          <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium tracking-wide">
            To Address
          </span>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            required
            className={`bg-slate-800/65 dark:bg-slate-800/65 light:bg-slate-50 border ${invalidAddress ? 'border-red-500/70' : 'border-white/10 dark:border-white/10 light:border-slate-300'} text-slate-100 dark:text-slate-100 light:text-slate-900 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 ${invalidAddress ? 'focus:ring-red-500/60' : 'focus:ring-sky-500/50'}`}
          />
          {invalidAddress && (
            <div className="mt-1 text-[11px] text-red-400 font-medium tracking-wide">
              Invalid address
            </div>
          )}
        </label>
        <label className="flex flex-col gap-1.5 text-sm flex-1 min-w-[calc(50%-0.5rem)]">
          <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium tracking-wide">
            Amount
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.0001"
            required
            className="bg-slate-800/65 dark:bg-slate-800/65 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-100 dark:text-slate-100 light:text-slate-900 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm flex-1 min-w-[calc(50%-0.5rem)]">
          <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium tracking-wide">
            Network Fee (est.)
          </span>
          <input 
            type="text" 
            value={feeEstimate} 
            disabled
            className="bg-slate-800/65 dark:bg-slate-800/65 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600 px-3.5 py-2.5 rounded-xl text-sm opacity-60 cursor-not-allowed"
          />
        </label>
        <button 
          type="submit" 
          disabled={!fromAddress || !toAddress || !validateAddress(toAddress) || !amount}
          className={`w-full mt-6 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-shadow ${(!fromAddress || !toAddress || !validateAddress(toAddress) || !amount) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Send
        </button>
        {status && (
          <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-4 w-full">
            {status}
          </div>
        )}
      </form>
    </section>
  );
};

export default SendForm;
