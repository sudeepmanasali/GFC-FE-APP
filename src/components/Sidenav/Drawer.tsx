import HelpOutlineSharpIcon from '@mui/icons-material/HelpOutlineSharp';
import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import SettingsSharpIcon from '@mui/icons-material/SettingsSharp';
import { Drawer, IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React, { useState } from 'react';
import formimage from "../../assets/images/forms-icon.png";
import docimage from "../../assets/images/google-docs--v1.png";
import driveimage from "../../assets/images/google-drive--v1.png";
import excelsheetimage from "../../assets/images/google-sheets.png";
import slidesimage from "../../assets/images/google-slides.png";
import "./Drawer.scss";

// component to display the side nav bar
export default function TemporaryDrawer() {

  const [state, setState] = useState({
    left: false
  });

  const toggleDrawer = (anchor: string, open: boolean) => () => {
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: string) => (
    <div style={{ width: "250px" }} role="presentation" onClick={toggleDrawer(anchor, false)}>
      <Divider />
      <List>
        <ListItem className="logo_title">
          <ListItemText style={{ fontSize: "48px", marginLeft: "5px" }}>
            <span style={{ color: "blue", fontWeight: "700", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}>G</span>
            <span style={{ color: "red", fontWeight: "500", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}>o</span>
            <span style={{ color: "yellow", fontWeight: "500", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}>o</span>
            <span style={{ color: "blue", fontWeight: "500", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}>g</span>
            <span style={{ color: "green", fontWeight: "500", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}>l</span>
            <span style={{ color: "red", fontWeight: "500", fontSize: "22px", marginRight: "10px", fontFamily: "'Product Sans',Arial,sans-serif" }}>e</span>
            <span style={{ color: "#5f6368", fontWeight: "500", fontSize: "22px", fontFamily: "'Product Sans',Arial,sans-serif" }}> Docs</span>
          </ListItemText>
        </ListItem>
      </List>

      <Divider />
      <List style={{ marginLeft: "08px", marginRight: "8px", marginTop: "15px" }}>
        <ListItem className="list-item">
          <img src={docimage} alt="noImage" />
          <div> Docs</div>
        </ListItem>

        <ListItem className="list-item">
          <img src={excelsheetimage} alt="noImage" />
          <div>Sheets</div>
        </ListItem>

        <ListItem className="list-item">
          <img src={slidesimage} alt="noImage" />
          <div>Slides</div>
        </ListItem>

        <ListItem className="list-item">
          <img src={formimage} alt="noImage" />
          <div> Forms</div>
        </ListItem>
      </List>

      <Divider />
      <List style={{ marginLeft: "08px", marginRight: "08px", marginTop: "15px" }}>
        <ListItem className="list-item" >
          <SettingsSharpIcon />
          <div style={{ marginLeft: "20px", fontSize: "14px" }}> Settings</div>
        </ListItem>

        <ListItem className="list-item">
          <HelpOutlineSharpIcon />
          <div> Help & Feedback</div>
        </ListItem>
      </List>

      <Divider />
      <List style={{ marginLeft: "08px", marginRight: "08px", marginTop: "15px" }}>
        <ListItem className="list-item">
          <img src={driveimage} alt="noImage" />
          <div style={{ marginLeft: "20px", fontSize: "14px" }}> Drive</div>
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  return (
    <div>
      <React.Fragment key={'left'}>
        <IconButton onClick={toggleDrawer('left', true)}>
          <MenuSharpIcon />
        </IconButton>
        <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
          {list('left')}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
