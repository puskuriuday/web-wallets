import React, { useState } from 'react';

interface LockScreenProps {
  onUnlock: (password: string) => boolean;
  onCreatePassword: () => void;
  hasPassword: boolean;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, onCreatePassword, hasPassword }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(password);
    if (!success) {
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 grid place-items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 light:from-slate-100 light:via-slate-50 light:to-slate-100 z-[200]">
      <div className="w-full max-w-[380px] mx-5 p-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 dark:from-white/10 light:from-white light:to-white border border-white/10 dark:border-white/10 light:border-slate-200 backdrop-blur-xl shadow-2xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          UD Wallets
        </h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
          Secure local access
        </p>
        <form onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm mt-6">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium tracking-wide">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              autoFocus
              className="bg-slate-800/65 dark:bg-slate-800/65 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-100 dark:text-slate-100 light:text-slate-900 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </label>
          <button 
            type="submit" 
            className="w-full mt-8 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-shadow duration-300"
          >
            Unlock
          </button>
        </form>
        {!hasPassword && (
          <button 
            className="mt-6 text-sm text-sky-500 underline hover:text-sky-400 transition-colors"
            onClick={onCreatePassword}
          >
            First time? Create password
          </button>
        )}
      </div>
    </div>
  );
};

export default LockScreen;
