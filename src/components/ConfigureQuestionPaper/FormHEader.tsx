import React from "react";
import form_image from "../../assets/images/forms-icon.png";
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Button, IconButton, Modal, Tooltip } from "@mui/material";
import "./FormHeader.scss";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AlertDialog from "../common/Alert";
import { useTheme } from "../contexts/themeContext";
import { useQuestionPaper } from "../contexts/questionPaperContext";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useNavigate, useParams } from "react-router-dom";
import { HTTP_METHODS, REQUEST_URLS, ROUTE_PATHS } from "../../utils/constants";
import toast from "react-hot-toast";
import useAxios from "utils/axios";
import ProfileButton from "components/common/Dropdown";


function FormHeader() {
  const HttpRequestController = useAxios();
  const { theme, setTheme } = useTheme();
  const { questionPaper, setQuestionPaper } = useQuestionPaper();
  const user = {
    email: 'sudeepmanasali@gmail.com',
    name: 'sudeep'
  }
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  let params = useParams();

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

  const sendDeleteRequest = async () => {
    const res = await HttpRequestController(REQUEST_URLS.DELETE_DOCUMENT + `/${params.documentId}`, HTTP_METHODS.DELETE);
    if (res) {
      goToHomeScreen();
    }
  }

  const deleteDocument = () => {
    toast.promise(
      sendDeleteRequest(),
      {
        loading: 'Request in progress',
        success: 'Document deleted successfully',
        error: 'Document is not deleted, Please try again'
      }
    );
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
                    onClick={deleteDocument}
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
              <ProfileButton />
            </div>
          </div></>)
      }
    </React.Fragment>
  );
}

export default FormHeader;
