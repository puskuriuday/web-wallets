import React, { useEffect, useState } from 'react';
import { storeData, getData } from '../utils/localStore';

const NavBar: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Load stored theme on mount
  useEffect(() => {
    const storedTheme = getData('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  // Toggle light/dark mode
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      storeData('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      storeData('theme', 'light');
    }
  };

  return (
    <nav
      className={`w-full shadow-md sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300 ${
        darkMode ? 'bg-gray-900/95 text-gray-100' : 'bg-white/95 text-gray-900'
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3">
        {/* Left side — logo + title */}
        <div className="flex items-center space-x-2">
          <img
            src={darkMode ? '/Dark.jpg' : '/Light.png'}
            alt="UD-Wallets Logo"
            className="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300"
          />
          <span className="text-lg sm:text-xl font-semibold select-none">
            UD-Wallets
          </span>
        </div>

        {/* Right side — theme toggle */}
        <button
          onClick={toggleTheme}
          className="relative flex items-center w-10 sm:w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none"
          aria-label="Toggle Dark Mode"
        >
          {/* Sun icon (light mode) */}
          <svg
            aria-hidden="true"
            className={`absolute left-1 h-4 w-4 text-yellow-400 transition-opacity duration-300 ${
              darkMode ? 'opacity-0' : 'opacity-100'
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>

          {/* Moon icon (dark mode) */}
          <svg
            aria-hidden="true"
            className={`absolute right-1 h-4 w-4 text-indigo-200 transition-opacity duration-300 ${
              darkMode ? 'opacity-100' : 'opacity-0'
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>

          {/* Toggle circle */}
          <span
            className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
              darkMode ? 'translate-x-4 sm:translate-x-6' : ''
            }`}
          />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
