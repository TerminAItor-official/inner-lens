import React, { createContext, useContext, useState, useEffect } from 'react';

export const themes = {
  brand:      { bg: '#F5F1EA', text: '#4A4541', accent: '#D8A7A0' },
  freud:      { bg: '#F5EDE8', text: '#6B4C3B', accent: '#A0522D' },
  anna_freud: { bg: '#EDF2F7', text: '#4A5568', accent: '#718096' },
  winnicott:  { bg: '#E8F5E9', text: '#2D6A4F', accent: '#40916C' },
  jung:       { bg: '#FDF3E3', text: '#4A3728', accent: '#8B6914' },
  klein:      { bg: '#F8E8F8', text: '#6B2D6B', accent: '#9B59B6' },
  lacan:      { bg: '#E8F0F8', text: '#1A3A5C', accent: '#2E6DA4' },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [philosopher, setPhilosopher] = useState('brand');

  useEffect(() => {
    const theme = themes[philosopher] || themes.brand;
    const root = document.documentElement;
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--text-primary', theme.text);
    root.style.setProperty('--accent', theme.accent);
  }, [philosopher]);

  return (
    <ThemeContext.Provider value={{ philosopher, setPhilosopher, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
