"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import SocketProvider from "~/utils/context/SocketContext";
import VideoContextProvider from "~/utils/context/VideoContext";
import useServiceWorker from "~/utils/hooks/useServiceWorker";
import { getLocalView } from "~/utils/localSrorageService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import { twMerge } from "tailwind-merge";

export const ThemeContext = createContext();
export const DisplayContext = createContext();

const queryClient = new QueryClient();

const Provider = ({ children, serverSession }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [columnView, setColumnView] = useState(getLocalView());
  const colorTheme = darkMode ? "dark" : "";
  
  useServiceWorker();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");

    if (darkMode) {
      root.classList.add(colorTheme);
    }

    localStorage.setItem("theme", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("columnView", JSON.stringify(columnView));
  }, [columnView]);

  return (
    <SessionProvider>
      <SocketProvider serverSession={serverSession}>
        <PrimeReactProvider
          value={{
            unstyled: true,
            pt: Tailwind,
            ptOptions: {
              mergeSections: true,
              mergeProps: true,
              classNameMergeFunction: twMerge,
            },
          }}
        >
          <QueryClientProvider client={queryClient}>
            <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
              <DisplayContext.Provider value={{ columnView, setColumnView }}>
                <VideoContextProvider>{children}</VideoContextProvider>
              </DisplayContext.Provider>
            </ThemeContext.Provider>
          </QueryClientProvider>
        </PrimeReactProvider>
      </SocketProvider>
    </SessionProvider>
  );
};

export default Provider;
