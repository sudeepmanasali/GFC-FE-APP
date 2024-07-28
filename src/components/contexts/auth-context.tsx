import React, { createContext, useContext, useState } from 'react';
import { AuthContextType, SESSION_STORAGE_KEYS } from '../../utils/constants';
import getUserInfo from 'utils/auth-validate';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

// provides the authorisation details, login and logout methods
export const AuthProvider: React.FC<any> = ({ children }) => {
  const [isLoggedIn, setIsLogged] = useState(localStorage.getItem(SESSION_STORAGE_KEYS.IS_AUTH) == 'true');
  const [user, setUser] = useState(getUserInfo().user);

  const handleLogin = (val: any) => {
    setIsLogged(true);
    setUser(getUserInfo().user);
  };

  const handleLogout = (val: any) => {
    localStorage.clear();
    setIsLogged(false);
  };

  const contextValue = {
    isLoggedIn,
    user
  }

  return (
    <AuthContext.Provider value={{ ...contextValue, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
