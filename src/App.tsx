import './App.scss';
import React, { useEffect, useState } from 'react';
import { Header } from './components/Header/Header';
import { Mainbody } from './components/Mainbody/Mainbody';
import Templates from './components/Mainbody/Templates';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import FormHeader from './components/ConfigureQuestionPaper/FormHEader';
import CenteredTabs from './components/common/Tabs';
import { ROUTE_PATHS, SESSION_STORAGE_KEYS } from './utils/constants';
import { ThemeProvider } from './components/contexts/themeContext';
import { QuestionPaperProvider } from './components/contexts/questionPaperContext';
import { Toaster } from 'react-hot-toast';
import useAuthListener from './utils/auth-validate';

function App() {
  let [isLogin, setLogin] = useState<any>(localStorage.getItem(SESSION_STORAGE_KEYS.IS_AUTH));
  const { user } = useAuthListener();
  const checkAuth = async () => {
    if (user) {
      setLogin(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTE_PATHS.LOGIN} element={<Login />}></Route>
          <Route path={ROUTE_PATHS.HOME} element={isLogin ? (
            <>
              <Header />
              <Templates />
              <Mainbody />
            </>
          ) : (
            <Navigate to={ROUTE_PATHS.LOGIN} />
          )}
          >
          </Route>
          <Route path={ROUTE_PATHS.QUESTION_PAPER} element={isLogin ? (
            <QuestionPaperProvider>
              <ThemeProvider>
                <FormHeader />
                <CenteredTabs />
              </ThemeProvider>
            </QuestionPaperProvider>
          ) : (
            <Navigate to={ROUTE_PATHS.LOGIN} />
          )}
          >
          </Route>
          <Route path={"*"} element={<Navigate to={ROUTE_PATHS.LOGIN} />}></Route>
        </Routes>
      </BrowserRouter >
      <Toaster />
    </div >
  );
}

export default App;
