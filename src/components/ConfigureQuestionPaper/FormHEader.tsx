import React from "react";
import form_image from "../../assets/images/forms-icon.png";
import avatarimage from "../../assets/images/2.jpg";
// import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Avatar, Button, IconButton, Modal, Tooltip } from "@mui/material";
import { useParams } from "react-router";
import "./FormHeader.scss";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SettingsIcon from '@mui/icons-material/Settings';
import { shortString } from "../../utils/util";
import AlertDialog from "../common/Alert";
import { useTheme } from "../contexts/themeContext";
import { useQuestionPaper } from "../contexts/questionPaperContext";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../utils/constants";


function FormHeader() {
  const { theme, setTheme } = useTheme();
  const { questionPaper, setQuestionPaper } = useQuestionPaper();
  const user = {
    email: 'sudeepmanasali@gmail.com',
    name: 'sudeep'
  }
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();


  const changeTheme = () => {
    setTheme({
      ...theme,
      backgroundColor: theme.backgroundColor === '#ffffff' ? '#000000' : '#ffffff',
      textColor: theme.textColor === '#000000' ? '#ffffff' : '#000000',
    });
  };

  const openQuestionPaper = () => {
    setQuestionPaper({
      ...questionPaper,
      showQuestionPaper: !questionPaper.showQuestionPaper
    });
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const goToHomeScreen = () => {
    navigate(ROUTE_PATHS.HOME);
  };


  return (
    <React.Fragment>
      {
        !questionPaper.showQuestionPaper && (<>
          <div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div className='paper'>
                <h2
                  id="simple-modal-title"
                >
                  Are you sure to delete this question paper?
                </h2>
                <div className='btns'>
                  <Button variant="contained" color="inherit" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    variant="contained"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
          <div className="form-header">
            <div className="form-header-left">
              <img
                src={form_image}
                alt="noImage"
                onClick={goToHomeScreen}
              />
              <input
                type="text"
                placeholder="Untitled form"
                className="form-name"
                value={questionPaper.documentName} />
              <IconButton><FolderOpenIcon className="form-header-icon" ></FolderOpenIcon></IconButton>
              <IconButton><StarBorderIcon className="form-header-icon" /></IconButton>
            </div>

            <div className="form-header-right">
              <Tooltip title="Customize theme">
                <IconButton>
                  <ColorLensIcon className="form-header-icon" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Preview">
                <IconButton onClick={openQuestionPaper}>
                  <RemoveRedEyeIcon className="form-header-icon" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Undo">
                <IconButton>
                  <UndoIcon className="form-header-icon" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Redo">
                <IconButton>
                  <RedoIcon className="form-header-icon" />
                </IconButton>
              </Tooltip>


              <Tooltip title="Delete">
                <IconButton onClick={() => {
                  handleOpen();
                }}>
                  <DeleteIcon className="form-header-icon" />
                </IconButton>
              </Tooltip>

              <AlertDialog />

              <Tooltip title="More">
                <IconButton>
                  <MoreVertIcon className="form-header-icon mode" />
                </IconButton>
              </Tooltip>

              <div className="dropdown">
                <IconButton className="mode dropbtn">
                  <Avatar src={avatarimage} />
                </IconButton>
                <div className="dropdown-content">
                  <a data-toggle="tooltip" data-placement="top" title={user.email}>
                    {shortString(user.email, 12)}
                  </a>
                  <a data-toggle="tooltip" data-placement="top" title={user.name}>
                    {shortString(user.name, 12)}
                  </a>
                  <a
                    style={{ color: "blue" }}
                    onClick={() => {
                      localStorage.clear();
                      // history.push("/login");
                    }}
                  >
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div></>)
      }
    </React.Fragment>
  );
}

export default FormHeader;
