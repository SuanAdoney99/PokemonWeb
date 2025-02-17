// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // El estado darkMode controla el modo oscuro
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(prev => !prev);

  // Se agregan o quitan clases de Bootstrap a <body> según el tema
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-dark', 'text-light');
      document.body.classList.remove('bg-light', 'text-dark');
    } else {
      document.body.classList.add('bg-light', 'text-dark');
      document.body.classList.remove('bg-dark', 'text-light');
    }
  }, [darkMode]);

  // La clase a aplicar en la raíz de la app (complementaria a las clases de Bootstrap)
  const themeClass = darkMode ? 'dark-mode' : 'light-mode';

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, themeClass }}>
      {children}
    </ThemeContext.Provider>
  );
};
