

import { Paper, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { a11yProps } from '../../utils/util';
import "./Alert.scss";
import { QuestionForm } from '../ConfigureQuestionPaper/QuestionUI';

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

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Paper className="root">
      <Tabs value={value} onChange={handleChange} indicatorColor="primary"
        textColor="primary" centered className="tabs">
        <Tab label="Questions" className="tab" {...a11yProps(0)} />
        <Tab label="Responses" className="tab" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <QuestionForm />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <div>user form responses</div>
      </TabPanel>
    </Paper>
  )
}
