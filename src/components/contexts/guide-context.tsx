import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateTokenAge } from 'utils/auth-validate';
import { ROUTE_PATHS, SESSION_STORAGE_KEYS } from 'utils/constants';

const GuideContext = createContext<any>(undefined);

const useGuide = () => {
  const context = useContext(GuideContext);
  if (!context) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
};

const homePageGuide = [
  {
    selector: '.header-search',
    content: 'Search the documents',
  },
  {
    selector: '.card',
    content: 'Click here to create new document',
  },
  {
    selector: '.header-right',
    content: 'Use this to toggle view type of the documents',
  },
  {
    selector: '.doc-card',
    content: 'Click here open the card',
  }
];

const documentPageGuide = [
  {
    selector: '.preview',
    content: 'Click here to view the document',
  },
  {
    selector: '.delete',
    content: 'Click here to delete the document',
  },
  {
    selector: '.add-question-btn',
    content: 'Click here to add new question',
  },
  {
    selector: '.question-container',
    content: 'Click to update the question',
  },
  {
    selector: '.save-button',
    content: 'Click to save the document',
  }
];

const GuideProvider: React.FC<any> = ({ children }) => {
  const [guideTour, setGuideTour] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // check whether the current page tour is completed or not
    const completedAppTour: { [key: string]: boolean } = JSON.parse(localStorage.
      getItem(SESSION_STORAGE_KEYS.APP_TOUR_COMPLETED) || '{}');

    setGuideTour(!completedAppTour[window.location.pathname]);

    // update the current page tour status 
    localStorage.setItem(SESSION_STORAGE_KEYS.APP_TOUR_COMPLETED, JSON.stringify({
      ...completedAppTour,
      [window.location.pathname]: true
    }));

    if (!validateTokenAge()) {
      navigate(ROUTE_PATHS.LOGIN);
    }
  }, [window.location.href]);

  // stop the guide tour
  const closeTour = () => {
    setGuideTour(false);
  };

  return (
    <GuideContext.Provider value={{ guideTour, closeTour, documentPageGuide, homePageGuide }}>
      {children}
    </GuideContext.Provider>
  );
};

export { GuideProvider, useGuide };
