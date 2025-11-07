import { useEffect, useState } from 'react';
import { genmnemonic } from '../utils/mnemonic';
import { getData, storeData } from '../utils/localStore';

interface MnemonicRevealProps {
  onComplete: () => void;
}

const MnemonicReveal = ({ onComplete }: MnemonicRevealProps) => {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let existing = getData('mnemonic');
    if (!existing) {
      const { mnemonic: created } = genmnemonic();
      existing = created;
    }
    setMnemonic(existing);
  }, []);

  const words = mnemonic.trim().split(/\s+/);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  };

  const handleConfirm = () => {
    storeData('mnemonicAcknowledged', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-black/55 z-[1000] flex items-center justify-center p-5">
      <div className="bg-slate-900 dark:bg-slate-900 light:bg-white text-slate-100 dark:text-slate-100 light:text-slate-900 rounded-2xl p-8 w-full max-w-[640px] shadow-2xl border border-white/12 dark:border-white/12 light:border-slate-200">
        <h2 className="mt-0 mb-2 text-xl font-semibold">Recovery Phrase</h2>
        <p className="mt-0 text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm">
          Write these 12 words in order and store them securely. Anyone with this phrase can access your funds.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 mt-3">
          {words.map((w: string, i: number) => (
            <div 
              key={i} 
              className="bg-white/7 dark:bg-white/7 light:bg-slate-100 p-2.5 rounded-xl text-sm flex gap-1.5 items-center font-mono"
            >
              <span className="opacity-60 text-xs">{i + 1}.</span> 
              <span>{w}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5 flex-wrap">
          <button 
            onClick={handleCopy} 
            className="flex-1 px-5 py-3 rounded-xl text-sm font-medium tracking-wide bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 light:from-slate-100 light:to-slate-200 text-slate-100 dark:text-slate-100 light:text-slate-900 border border-white/20 dark:border-white/20 light:border-slate-300 hover:shadow-lg transition-shadow"
          >
            {copied ? 'Copied!' : 'Copy Phrase'}
          </button>
          <button 
            onClick={handleConfirm} 
            className="flex-1 px-5 py-3 rounded-xl text-sm font-medium tracking-wide text-white bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-shadow"
          >
            I Saved It
          </button>
        </div>
      </div>
    </div>
  );
};

export default MnemonicReveal;