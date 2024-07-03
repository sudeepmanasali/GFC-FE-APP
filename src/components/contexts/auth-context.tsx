import React, { createContext, useContext, useState } from 'react';
import { AuthContextType, SESSION_STORAGE_KEYS } from '../../utils/constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<any> = ({ children }) => {
  const [isLoggedIn, setIsLogged] = useState(localStorage.getItem(SESSION_STORAGE_KEYS.IS_AUTH) == 'true');

  const handleLogin = (val: any) => {
    setIsLogged(true);
  }

  const handleLogout = (val: any) => {
    localStorage.clear();
    setIsLogged(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
