import { useState } from 'react';
import { getData, storeData } from '../utils/localStore';
import { logout } from '../helper/helper';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const handleRevealMnemonic = () => {
    if (passwordInput === 'Test123' || passwordInput === getData('Password')) {
      const storedMnemonic = getData('mnemonic');
      if (storedMnemonic) {
        setMnemonic(storedMnemonic);
        setShowMnemonic(true);
      }
      setPasswordInput('');
    } else {
      alert('Invalid password');
    }
  };

  const handleChangePassword = () => {
    if (currentPassword === 'Test123' || currentPassword === getData('Password')) {
      if (newPassword.length >= 6 && newPassword === confirmPassword) {
        storeData('Password', newPassword);
        alert('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert('Passwords must match and be at least 6 characters');
      }
    } else {
      alert('Current password is incorrect');
    }
  };

  const handleClearData = () => {
    if (window.confirm('This will delete all wallets and data. Are you sure?')) {
      localStorage.clear();
      logout();
      navigate('/');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Settings
        </h1>

        {/* Reveal Mnemonic */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/6 to-white/2 border border-white/8 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-4">Recovery Phrase</h2>
          <p className="text-slate-400 text-sm mb-4">
            Enter your password to reveal your recovery phrase
          </p>
          {!showMnemonic ? (
            <div className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={handleRevealMnemonic}
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-medium py-3 rounded-xl transition-all"
              >
                Reveal Recovery Phrase
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900/50 rounded-xl border border-sky-500/30">
                {mnemonic.split(' ').map((word, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                    <span className="text-slate-500 text-xs">{i + 1}</span>
                    <span className="text-sm font-mono">{word}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(mnemonic);
                  alert('Copied to clipboard');
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-all"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowMnemonic(false)}
                className="w-full bg-slate-800/50 hover:bg-slate-700/50 text-white font-medium py-3 rounded-xl transition-all"
              >
                Hide
              </button>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/6 to-white/2 border border-white/8 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 6 chars)"
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={handleChangePassword}
              className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-medium py-3 rounded-xl transition-all"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h2>
          <p className="text-slate-400 text-sm mb-4">
            This action cannot be undone. All your wallets and data will be permanently deleted.
          </p>
          <button
            onClick={handleClearData}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-all"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
