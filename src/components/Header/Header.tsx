import AppsIcon from '@mui/icons-material/Apps';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from "@mui/material";
import React, { memo } from "react";
import formimage from "../../assets/images/forms-icon.png";
import "./Header.scss"
import TemporaryDrawer from '../Sidenav/Drawer';
import ProfileButton from 'components/common/Dropdown';
import { useDocumentsName } from 'components/contexts/documents-context';
import { useGuide } from 'components/contexts/guide-context';
import Tour from 'reactour';

// Header displayed on home page
export const Header = memo(() => {
  const { handleInputChange } = useDocumentsName();
  const { guideTour, closeTour, homePageGuide } = useGuide();

  return <div className="header">
    <div className="header-info">
      <TemporaryDrawer />
      <img src={formimage} alt="no-image" className="form-image" />
      <div className="info">Forms</div>
    </div>
    <div className="header-search">
      <IconButton>
        <SearchIcon />
      </IconButton>
      <input type="text" placeholder="Search" onChange={(e) => handleInputChange(e.target.value)} />
    </div>
    <div className="row">
      <IconButton style={{ margin: "0px" }}>
        <AppsIcon style={{ fontSize: "22px" }} />
      </IconButton>
      <ProfileButton />
    </div>
    <Tour
      steps={homePageGuide}
      isOpen={guideTour}
      onRequestClose={closeTour}
      accentColor="#5cb7b7"
    />
  </div>
});
