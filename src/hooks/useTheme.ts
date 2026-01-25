"use client";

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'shinobi-theme-preference';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // Fallback to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    setIsInitialized(true);
  }, []);

  // Update localStorage and document class when theme changes
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setLightTheme = () => {
    setTheme('light');
  };

  const setDarkTheme = () => {
    setTheme('dark');
  };

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setTheme,
  };
}
