export const applyStoredTheme = () => {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', useDark);
  } catch {}
};

export const setTheme = (mode: 'dark' | 'light') => {
  localStorage.setItem('theme', mode);
  document.documentElement.classList.toggle('dark', mode === 'dark');
};

export const toggleTheme = () => {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
};
