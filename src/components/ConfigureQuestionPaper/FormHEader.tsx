import React, { useEffect } from "react";
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
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HTTP_METHODS, QUESTION_ACTION_TYPES, REQUEST_FAILURE_MESSAGES, REQUEST_IN_PROGRESS, REQUEST_SUCCESS_MESSAGES, REQUEST_URLS, ROUTE_PATHS } from "../../utils/constants";
import useAxios from "utils/axios";
import ProfileButton from "components/common/Dropdown";
import { useDocument } from "components/contexts/questions-context";

function FormHeader() {
  const { HttpRequestController, isRequestPending, handlePromiseRequest } = useAxios();
  const { viewDocument, documentName, dispatch } = useDocument();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  let params = useParams();
  const location = useLocation();
  const isEditable = location.state?.edit || false;

  useEffect(() => {
    if (!isEditable) {
      dispatch({ type: QUESTION_ACTION_TYPES.VIEW_DOCUMENT });
    }
  }, []);

  const openQuestionPaper = () => {
    dispatch({
      type: QUESTION_ACTION_TYPES.VIEW_DOCUMENT
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
    handlePromiseRequest(sendDeleteRequest, REQUEST_IN_PROGRESS, REQUEST_SUCCESS_MESSAGES.DOCUMENT_DELETED_SUCCESSFULLY,
      REQUEST_FAILURE_MESSAGES.DOCUMENT_DELETION_FAILED);
  };

  return (
    <React.Fragment>
      {
        !viewDocument && (<>
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
                  Are you sure to delete this document ?
                </h2>
                <div className='btns'>
                  <Button variant="contained" color="inherit" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={isRequestPending}
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
                value={documentName} />
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
                  <RemoveRedEyeIcon className="form-header-icon preview" />
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
                  <DeleteIcon className="form-header-icon delete" />
                </IconButton>
              </Tooltip>

              <AlertDialog url={`https://gf-clone-c266a.web.app${location.pathname}`} />

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
