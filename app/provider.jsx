'use client';

import { SessionProvider } from 'next-auth/react';
import { createContext, useEffect, useState } from 'react';
import SocketProvider from "~/utils/context/SocketContext";
import VideoContextProvider from '~/utils/context/VideoContext';
import { getLocalTheme, getLocalView } from '~/utils/localSrorageService'

export const ThemeContext = createContext();
export const DisplayContext = createContext();

const Provider = ({children}) => {
  const [darkMode, setDarkMode] = useState(true);
  const [columnView, setColumnView] = useState(getLocalView());
  const colorTheme = darkMode ? 'dark' : '';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');

    if (darkMode) {
      root.classList.add(colorTheme);
    }

    localStorage.setItem('theme', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('columnView', JSON.stringify(columnView));
  }, [columnView]);

  return (
    <SessionProvider>
      <SocketProvider>
        <ThemeContext.Provider value={{darkMode, setDarkMode}}>
          <DisplayContext.Provider value={{columnView, setColumnView}}>
            <VideoContextProvider>
              {children}
            </VideoContextProvider>
          </DisplayContext.Provider>
        </ThemeContext.Provider>
      </SocketProvider>
    </SessionProvider>
  )
};

export default Provider;
