import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import MnemonicReveal from './components/MnemonicReveal';
import LockScreen from './components/LockScreen';
import CreatePasswordModal from './components/CreatePasswordModal';
import Toast from './components/Toast';
import NotificationModal from './components/NotificationModal.tsx';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Receive from './pages/Receive';

import { getData, storeData } from './utils/localStore';
import { genmnemonic } from './utils/mnemonic';
import { login, checkLoginStatus, logout } from './helper/helper';

type ChainType = 'ethereum' | 'solana';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [chain, setChain] = useState<ChainType>('ethereum');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [debug, setDebug] = useState<string>('initializing');
  const [notification, setNotification] = useState<{ open: boolean; title: string; message: string; details?: string }>(
    { open: false, title: '', message: '', details: undefined }
  );

  const hasPassword = Boolean(getData('Password'));

  // Initialize - check login status
  useEffect(() => {
    const loggedIn = checkLoginStatus();
    setIsLocked(!loggedIn);
    setDebug(`mounted: loggedIn=${loggedIn}`);
    console.log('[App] mount loggedIn', loggedIn);

    if (loggedIn) {
      // Check if mnemonic needs to be shown
      const acknowledged = getData('mnemonicAcknowledged');
      if (acknowledged !== 'true') {
        setShowMnemonic(true);
        console.log('[App] showing mnemonic reveal');
      }
    }
    // First-time user: create mnemonic if absent
    const existingMnemonic = getData('mnemonic');
    if (!existingMnemonic) {
      try {
        genmnemonic(); // stores mnemonic internally
        console.log('[App] generated first-time mnemonic');
        storeData('mnemonicAcknowledged', 'false');
        if (!loggedIn) setShowMnemonic(true);
      } catch (e) {
        console.error('[App] mnemonic generation failed', e);
      }
    }

    // If password not present, immediately open create password modal
    if (!getData('Password')) {
      setShowCreatePassword(true);
      // ensure locked state so modal shows
      setIsLocked(true);
    }
  }, []);

  const showToast = (message: string) => {
    setToast({ show: true, message });
  };

  const handleUnlock = (password: string): boolean => {
    // Hardcoded Test123 for demo
    if (password === 'Test123') {
      login(password);
      setIsLocked(false);
      showToast('Unlocked (hardcoded)');
      return true;
    }

    // Check stored password
    const storedPassword = getData('Password');
    if (storedPassword && storedPassword === password) {
      login(password);
      setIsLocked(false);
      showToast('Unlocked');
      return true;
    }

    showToast('Invalid password');
    return false;
  };

  const handleCreatePassword = (password: string) => {
    storeData('Password', password);
    login(password);
    setShowCreatePassword(false);
    setIsLocked(false);
    showToast('Password created');
  };

  const handleLock = () => {
    logout();
    setIsLocked(true);
    showToast('Locked');
  };

  const handleNotify = (title: string, message: string, details?: any) => {
    setNotification({ open: true, title, message, details: details ? (typeof details === 'string' ? details : JSON.stringify(details, null, 2)) : undefined });
  };

  const closeNotification = () => setNotification({ open: false, title: '', message: '', details: undefined });

  return (
    <BrowserRouter>
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        {/* Debug indicator (temporary) */}
        <div className="fixed bottom-2 right-2 text-[10px] opacity-40 select-none font-mono">
          {debug} isLocked={String(isLocked)} hasPassword={String(hasPassword)}
        </div>

        {isLocked && (
          <>
            {hasPassword && !showCreatePassword && (
              <LockScreen
                onUnlock={handleUnlock}
                onCreatePassword={() => setShowCreatePassword(true)}
                hasPassword={hasPassword}
              />
            )}
            {showCreatePassword && (
              <CreatePasswordModal
                onClose={() => setShowCreatePassword(false)}
                onCreate={handleCreatePassword}
              />
            )}
          </>
        )}

        {!isLocked && (
          <>
            {showMnemonic && <MnemonicReveal onComplete={() => setShowMnemonic(false)} />}
            <NavBar onLock={handleLock} chain={chain} onChainChange={setChain} />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard currentChain={chain} onChainChange={setChain} onNotify={handleNotify} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/receive" element={<Receive currentChain={chain} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </>
        )}

        <Toast
          show={toast.show}
          message={toast.message}
          onHide={() => setToast({ show: false, message: '' })}
        />
        {notification.open && (
          <NotificationModal
            title={notification.title}
            message={notification.message}
            details={notification.details}
            onClose={closeNotification}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
