import React, { createContext, useContext, useState } from 'react';
import { Theme, ThemeContextType } from '../../utils/constants';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<any> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>({
    backgroundColor: '#ffffff',
    textColor: '#000000',
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
