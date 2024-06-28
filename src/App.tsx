import './App.scss';
import React from 'react';
import { Header } from './components/Header/Header';
import { Mainbody } from './components/Mainbody/Mainbody';
import Templates from './components/Mainbody/Templates';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StateContext } from './state-management/StateProvider';
import Login from './components/Login';
import FormHeader from './components/ConfigureQuestionPaper/FormHEader';
import CenteredTabs from './components/common/Tabs';
import { ROUTE_PATHS } from './utils/constants';

function App() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTE_PATHS.HOME} element={<><Header />
            <Templates />
            <Mainbody /></>}>
          </Route>
          <Route path={ROUTE_PATHS.LOGIN} element={<Login />}></Route>
          <Route path={ROUTE_PATHS.QUESTION_PAPER} element={<>
            <FormHeader />
            <CenteredTabs />
          </>}>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
