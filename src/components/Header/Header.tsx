import AppsIcon from '@mui/icons-material/Apps';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from "@mui/material";
import React from "react";
import formimage from "../../assets/images/forms-icon.png";
import "./Header.scss"
import TemporaryDrawer from '../Sidenav/Drawer';
import ProfileButton from 'components/common/Dropdown';
import { useDocumentsName } from 'components/contexts/documents-context';

export const Header = () => {
  const { filterFiles } = useDocumentsName();
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
      <input type="text" placeholder="Search" onChange={(e) => filterFiles(e.target.value)} />
    </div>
    <div className="row">
      <IconButton style={{ margin: "0px" }}>
        <AppsIcon style={{ fontSize: "22px" }} />
      </IconButton>
      <ProfileButton />
    </div>
  </div>
}
