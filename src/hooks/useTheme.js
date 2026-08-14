'use client';

import { useCallback, useEffect, useState } from 'react';

const THEME_KEY = 'idea-bank-theme';

/**
 * Three-state theme: '' follows the system, 'light' and 'dark' are explicit.
 *
 * The stored value is read after mount, never during render, because this
 * component is prerendered on the server where localStorage does not exist.
 * The inline script in the root layout has already applied the attribute by
 * then, so there is no flash while this catches up.
 */
export function useTheme() {
  const [theme, setTheme] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setTheme(localStorage.getItem(THEME_KEY) || '');
    } catch {
      /* storage blocked — fall back to following the system */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return; // don't overwrite storage before we've read it
    const root = document.documentElement;
    if (theme) root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage unavailable — the theme still applies for this session */
    }
  }, [theme, loaded]);

  // Cycle away from whatever the system is already showing first.
  const cycle = useCallback(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const order = prefersDark ? ['', 'light', 'dark'] : ['', 'dark', 'light'];
    setTheme((current) => order[(order.indexOf(current) + 1) % order.length]);
  }, []);

  return { theme, cycle };
}
