'use client';

import { SessionProvider } from 'next-auth/react';
import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();
export const DisplayContext = createContext();

const Provider = ({children}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [columnView, setColumnView] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localTheme = window.localStorage.getItem('theme');
      setDarkMode(localTheme === 'true');
    }
  }, []);

  useEffect(() => {
    typeof window !== "undefined" && window.localStorage.setItem('theme', String(darkMode));
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{darkMode, setDarkMode}}>
      <DisplayContext.Provider value={{columnView, setColumnView}}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </DisplayContext.Provider>
    </ThemeContext.Provider>
  )
};

export default Provider;
