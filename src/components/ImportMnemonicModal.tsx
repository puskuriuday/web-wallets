import React, { useState } from 'react';

interface ImportMnemonicModalProps {
  onClose: () => void;
  onImport: (mnemonic: string) => void;
}

const ImportMnemonicModal: React.FC<ImportMnemonicModalProps> = ({ onClose, onImport }) => {
  const [mnemonic, setMnemonic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onImport(mnemonic.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-sm grid place-items-center z-[180]">
      <div className="w-full max-w-[420px] mx-5 p-10 rounded-2xl bg-slate-900 dark:bg-slate-900 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl">
        <h2 className="text-xl font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
          Import Mnemonic
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm mt-6">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium tracking-wide">
              Mnemonic (BIP-39)
            </span>
            <textarea
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              rows={3}
              required
              className="bg-slate-800/65 dark:bg-slate-800/65 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-100 dark:text-slate-100 light:text-slate-900 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-vertical"
            />
          </label>
          <div className="flex gap-2 mt-6">
            <button 
              type="button" 
              className="px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-800 dark:bg-slate-800 light:bg-slate-100 text-slate-100 dark:text-slate-100 light:text-slate-900 border border-white/10 dark:border-white/10 light:border-slate-300 hover:shadow-lg hover:shadow-slate-500/10 transition-shadow"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-shadow"
            >
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportMnemonicModal;
