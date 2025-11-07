import { useState, useEffect } from 'react';
import { getData } from '../utils/localStore';

interface ReceiveProps {
  currentChain: 'ethereum' | 'solana';
}

export default function Receive({ currentChain }: ReceiveProps) {
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);

  useEffect(() => {
    loadWallets();
  }, [currentChain]);

  const loadWallets = () => {
    const key = `${currentChain}Wallets`;
    const stored = JSON.parse(getData(key) || '[]');
    setWallets(stored);
    if (stored.length > 0) {
      setSelectedWallet(stored[0]);
    }
  };

  const generateQR = (address: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(address)}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Receive {currentChain === 'ethereum' ? 'ETH' : 'SOL'}
        </h1>

        {wallets.length === 0 ? (
          <div className="p-12 rounded-2xl bg-gradient-to-br from-white/6 to-white/2 border border-white/8 backdrop-blur-xl text-center">
            <p className="text-slate-400">No wallets available. Create one first.</p>
          </div>
        ) : (
          <>
            {/* Wallet Selector */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/6 to-white/2 border border-white/8 backdrop-blur-xl">
              <label className="text-sm text-slate-400 mb-2 block">Select Wallet</label>
              <select
                value={selectedWallet?.publicKey || ''}
                onChange={(e) => {
                  const found = wallets.find(w => w.publicKey === e.target.value);
                  setSelectedWallet(found);
                }}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {wallets.map((w) => (
                  <option key={w.publicKey} value={w.publicKey}>
                    {w.publicKey.slice(0, 8)}...{w.publicKey.slice(-6)} (Index {w.index})
                  </option>
                ))}
              </select>
            </div>

            {/* QR Code */}
            {selectedWallet && (
              <div className="p-8 rounded-2xl bg-gradient-to-br from-white/6 to-white/2 border border-white/8 backdrop-blur-xl">
                <div className="text-center space-y-6">
                  <div className="bg-white p-4 rounded-2xl inline-block">
                    <img
                      src={generateQR(selectedWallet.publicKey)}
                      alt="QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Your Address</label>
                    <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl p-4">
                      <code className="text-sm flex-1 break-all">{selectedWallet.publicKey}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedWallet.publicKey);
                          alert('Address copied to clipboard');
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 rounded-lg text-sm font-medium transition-all"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <p className="text-sm text-yellow-400">
                      ⚠️ Only send {currentChain === 'ethereum' ? 'Ethereum (ETH)' : 'Solana (SOL)'} to this address. 
                      Sending other tokens may result in permanent loss.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
