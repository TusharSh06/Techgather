import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [colorScheme, setColorScheme] = useState(() => {
    const savedColorScheme = localStorage.getItem('colorScheme');
    return savedColorScheme || 'default';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorScheme', colorScheme);
    
    // Update document classes
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Update color scheme
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
  }, [theme, colorScheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const updateColorScheme = (scheme) => {
    setColorScheme(scheme);
  };

  const themeColors = {
    default: {
      primary: 'indigo',
      secondary: 'purple',
      accent: 'pink'
    },
    blue: {
      primary: 'blue',
      secondary: 'cyan',
      accent: 'teal'
    },
    green: {
      primary: 'green',
      secondary: 'emerald',
      accent: 'lime'
    },
    red: {
      primary: 'red',
      secondary: 'rose',
      accent: 'orange'
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      colorScheme, 
      updateColorScheme,
      themeColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
}; 