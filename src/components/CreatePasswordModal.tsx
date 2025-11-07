import React, { useState } from 'react';

interface CreatePasswordModalProps {
  onClose: () => void;
  onCreate: (password: string) => void;
}

const CreatePasswordModal: React.FC<CreatePasswordModalProps> = ({ onClose, onCreate }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onCreate(newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-sm grid place-items-center z-[180]">
      <div className="w-full max-w-[420px] mx-5 p-10 rounded-2xl bg-slate-900 dark:bg-slate-900 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl">
        <h2 className="text-xl font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900">
          Create Password
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm mt-6">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium tracking-wide">
              New Password
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              autoFocus
              className="bg-slate-800/65 dark:bg-slate-800/65 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-100 dark:text-slate-100 light:text-slate-900 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm mt-4">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium tracking-wide">
              Confirm Password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="bg-slate-800/65 dark:bg-slate-800/65 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-300 text-slate-100 dark:text-slate-100 light:text-slate-900 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </label>
          {error && (
            <div className="text-sm text-red-500 mt-4">
              {error}
            </div>
          )}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePasswordModal;
