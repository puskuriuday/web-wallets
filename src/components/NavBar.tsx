import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavBarProps {
  onLock: () => void;
  chain: 'ethereum' | 'solana';
  onChainChange: (chain: 'ethereum' | 'solana') => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLock, chain, onChainChange }) => {
  const location = useLocation();

  // Load stored theme on mount
  // Dark mode forced globally; no toggle action.

  // Toggle light/dark mode
  // Theme permanently dark; no toggle.

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/receive', label: 'Receive', icon: '📥' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
  <nav className="sticky top-0 flex items-center justify-between px-7 py-2.5 bg-slate-950 border-b border-white/5 z-40 transition-colors">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          <img src="/favicon.svg" alt="UD" className="w-6 h-6" />
          UD Wallets
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-2">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Chain Selector */}
        <div className="flex gap-2">
          <button
            data-chain="ethereum"
            className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all border ${
              chain === 'ethereum'
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 light:from-slate-100 light:to-slate-200 text-slate-100 dark:text-slate-100 light:text-slate-900 border-white/10 dark:border-white/10 light:border-slate-300 shadow-lg'
                : 'bg-slate-900 dark:bg-slate-900 light:bg-white text-slate-400 dark:text-slate-400 light:text-slate-600 border-white/8 dark:border-white/8 light:border-slate-200 hover:text-slate-100 dark:hover:text-slate-100 light:hover:text-slate-900'
            }`}
            onClick={() => onChainChange('ethereum')}
          >
            Ethereum
          </button>
          <button
            data-chain="solana"
            className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all border ${
              chain === 'solana'
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 light:from-slate-100 light:to-slate-200 text-slate-100 dark:text-slate-100 light:text-slate-900 border-white/10 dark:border-white/10 light:border-slate-300 shadow-lg'
                : 'bg-slate-900 dark:bg-slate-900 light:bg-white text-slate-400 dark:text-slate-400 light:text-slate-600 border-white/8 dark:border-white/8 light:border-slate-200 hover:text-slate-100 dark:hover:text-slate-100 light:hover:text-slate-900'
            }`}
            onClick={() => onChainChange('solana')}
          >
            Solana
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="w-10 h-10 rounded-xl grid place-items-center text-lg bg-slate-900 text-slate-400 border border-white/10 select-none" title="Dark mode forced">
          �
        </div>

        {/* Lock Button */}
        <button 
          onClick={onLock} 
          className="w-10 h-10 rounded-xl grid place-items-center text-lg bg-slate-900 dark:bg-slate-900 light:bg-white text-slate-400 dark:text-slate-400 light:text-slate-600 border border-white/8 dark:border-white/8 light:border-slate-200 hover:text-slate-100 dark:hover:text-slate-100 light:hover:text-slate-900 hover:shadow-lg hover:shadow-slate-500/10 transition-all"
          title="Lock"
        >
          🔒
        </button>
      </div>
    </nav>
  );
};

export default NavBar;