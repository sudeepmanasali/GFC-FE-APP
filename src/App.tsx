import './App.scss';
import React from 'react';
import { Header } from './components/Header/Header';
import { Mainbody } from './components/Mainbody/Mainbody';
import Templates from './components/Mainbody/Templates';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import FormHeader from './components/ConfigureQuestionPaper/FormHEader';
import CenteredTabs from './components/common/Tabs';
import { ROUTE_PATHS } from './utils/constants';
import { ThemeProvider } from './components/contexts/themeContext';
import { Toaster } from 'react-hot-toast';
import { useAuth } from 'components/contexts/auth-context';
import { DocumentContextProvider } from 'components/contexts/questions-context';

function App() {
  let { isLoggedIn } = useAuth();

  return (
    <div style={{ overflow: 'hidden' }}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTE_PATHS.LOGIN}
            element={!isLoggedIn ? (<Login />) : (
              <Navigate to={ROUTE_PATHS.HOME} replace />
            )} />

          <Route path={ROUTE_PATHS.HOME} element={isLoggedIn ? (
            <>
              <Header />
              <Templates />
              <Mainbody />
            </>
          ) : (
            <Navigate to={ROUTE_PATHS.LOGIN} replace />
          )}
          />
          <Route path={ROUTE_PATHS.QUESTION_PAPER} element={isLoggedIn ? (
            <DocumentContextProvider>
              <ThemeProvider>
                <FormHeader />
                <CenteredTabs />
              </ThemeProvider>
            </DocumentContextProvider>
          ) : (
            <Navigate to={ROUTE_PATHS.LOGIN} replace />
          )}
          >
          </Route>
          <Route path={"*"} element={<Navigate to={ROUTE_PATHS.LOGIN} replace />}></Route>
        </Routes>
      </BrowserRouter >
      <Toaster />
    </div >
  );
}

export default App;
