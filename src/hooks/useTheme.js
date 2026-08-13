import { useCallback, useEffect, useState } from 'react';

const THEME_KEY = 'idea-bank-theme';

/** Three-state theme: '' follows the system, 'light' and 'dark' are explicit. */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage unavailable — the theme still applies for this session */
    }
  }, [theme]);

  // Cycle away from whatever the system is already showing first.
  const cycle = useCallback(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const order = prefersDark ? ['', 'light', 'dark'] : ['', 'dark', 'light'];
    setTheme((current) => order[(order.indexOf(current) + 1) % order.length]);
  }, []);

  return { theme, cycle };
}
