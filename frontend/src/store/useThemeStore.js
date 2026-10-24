import { create } from 'zustand';

// Safely get theme from localStorage, or detect system preference
const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('skillpick-theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (err) {
    console.warn('Could not read theme from localStorage:', err);
  }

  // Fallback to prefers-color-scheme on first visit
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    try {
      localStorage.setItem('skillpick-theme', theme);
    } catch (err) {
      console.warn('Could not persist theme to localStorage:', err);
    }
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('skillpick-theme', next);
      } catch (err) {
        console.warn('Could not persist theme to localStorage:', err);
      }
      return { theme: next };
    });
  }
}));
