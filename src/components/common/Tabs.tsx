import { Divider, Paper, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { a11yProps } from '../../utils/util';
import "./Alert.scss";
import { QuestionForm } from '../ConfigureQuestionPaper/QuestionUI';
import { useDocument } from 'components/contexts/questions-context';
import DataTable from 'components/userview/UserResponseTab';
import Tour from 'reactour';
import { useGuide } from 'components/contexts/guide-context';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (<div>{children}</div>)}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function CenteredTabs() {
  const [value, setValue] = React.useState(0);
  const { viewDocument } = useDocument();
  const { guideTour, closeTour, documentPageGuide } = useGuide();

  // used to change the tabs view
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <div className={viewDocument ? "bg-green-color" : ""}>
      {
        !viewDocument && (<Paper className="root">
          <Tabs value={value} onChange={handleChange} indicatorColor={"primary"}
            textColor="primary" centered className="tabs">
            <Tab label="Questions" className="tab" {...a11yProps(0)} />
            <Tab label="Responses" className="tab" {...a11yProps(1)} />
          </Tabs>

          <TabPanel value={value} index={0}>
            <div style={{ background: "#e4f3e5" }}>
              <QuestionForm />
            </div>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <div className="user-response-container">
              <div className='header-title'>User Form Responses</div>
              {/* Display the user responses  */}
              <DataTable />
            </div>
          </TabPanel>
          <Divider />
        </Paper>)
      }

      {/* when user is viewing the question paper, the tab panels will noe be displayed so we will
      display below compoent here */}
      {
        viewDocument && (<QuestionForm />)
      }

      {/* avoid displaying the tour when the document, is in preview mode */}
      {
        !viewDocument && (<Tour
          steps={documentPageGuide}
          isOpen={guideTour}
          onRequestClose={closeTour}
          accentColor="#5cb7b7"
        />)
      }
    </div>
  )
}
