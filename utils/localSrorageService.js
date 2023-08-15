'use client'

export const getLocalTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem('theme') === 'true';
  }
};

export const getLocalView = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem('columnView') === 'true';
  }
};
