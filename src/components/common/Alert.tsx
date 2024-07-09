import PropTypes from 'prop-types';
import React from 'react';
import "./Alert.scss";
import { Button, Dialog, Tab, Tabs, TextField } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CodeIcon from '@mui/icons-material/Code';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}  {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AlertDialog: React.FC<any> = ({ url }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [value, setValue] = React.useState(1);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (<div>
    <Button variant="contained" color="success" href="#contained-buttons" onClick={handleClickOpen}>Send</Button>
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" className="dialog" aria-describedby="alert-dialog-description">
      <div className="dialog-content">
        <div className="dialog-title">
          <div>Send form</div>  <CloseIcon onClick={handleClose} className='icon-size' />
        </div>
        <div className="collect-email">
          <input type="checkbox" /> <span>Collect email addresses</span>
        </div>
        <div className="dialog-row">
          <div className="dialog-row-in">
            <div className="send-via">Send via</div>
            <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary">
              <Tab label={<EmailIcon />} {...a11yProps(0)} />
              <Tab label={<AttachFileIcon />} {...a11yProps(1)} />
              <Tab label={<CodeIcon />} {...a11yProps(2)} />
            </Tabs>
          </div>
          <div>
            <FacebookIcon className="icon-size" />
            <TwitterIcon className="icon-size" />
          </div>
        </div>
      </div>

      <div className="dialog-tab-panels-container">
        <TabPanel value={value} index={0}>
          <div className="dialog-tab-panels">
            <div className="tab-text">Email</div>
            <TextField label="To" size="small" defaultValue="To" className="text-field" />
            <TextField label="Subject" size="small" defaultValue="Untitled" className="text-field" />
            <TextField label="Message" size="small" defaultValue="I have invited you to fill the form" className="text-field" />
            <div className="include-email">
              <input type="checkbox" /> Included form in Email
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <div className="dialog-tab-panels">
            <div className="tab-text">Link</div>
            <TextField label="" size="small" defaultValue={url} className="text-field" />
            <div className="include-email">
              <input type="checkbox" /> Shorten URL
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <div className="dialog-tab-panels">
            <div className="tab-text">Embed HTML</div>
            <TextField label="" size="small" defaultValue="" className="text-field" />
          </div>

          <div className="dialog-tab-panels">
            <div className="tab-text">Form ID --- {"docID"}</div>
          </div>
        </TabPanel>
      </div>

      <div className="dialog-footer">
        <div className="dialog-footer-left">
          <PersonAddIcon className="icon-size add-colab" /> <span>Add collaborators</span>
        </div>
        <div className="dialog-footer-left">
          <Button variant="text" color="inherit" size="small" onClick={handleClose} className="dialog-button">cancel</Button>
          <Button variant="outlined" size="small" color="inherit" onClick={handleClose} className="send" >send</Button>
        </div>
      </div>
    </Dialog >
  </div >
  );
}

export default AlertDialog;
