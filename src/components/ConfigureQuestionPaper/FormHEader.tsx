import React from "react";
import form_image from "../../assets/images/forms-icon.png";
import avatarimage from "../../assets/images/2.jpg";
// import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Avatar, Button, IconButton, Modal } from "@mui/material";
import { useParams } from "react-router";
import "./FormHeader.scss";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SettingsIcon from '@mui/icons-material/Settings';
import { shortString } from "../../utils/util";
import AlertDialog from "../common/Alert";

function FormHeader() {
  // const { user, jwt } = useAuthListener();
  // const history = useHistory();
  // const [{ doc_name }] = useStateValue();
  const doc_name = 'Document Name';
  const user = {
    email: 'sudeepmanasali@gmail.com',
    name: 'sudeep'
  }
  const { id } = useParams();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function navigates() {
    // history.push("/response");
  }

  const deleteDocument = () => {
    // axios
    //     .delete(`${process.env.REACT_APP_BASE_URL}/deleteqp/${id}`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: localStorage.getItem("token"),
    //         },
    //     })
    //     .then((res) => {
    //         handleClose();
    //         toast.info("Document deleted");

    //         history.push("/");
    //     })
    //     .catch((err) => {
    //         if (validateTokenAge()) {
    //             history.push("/login");
    //         }

    //         if (err.message)
    //             err.response
    //                 ? toast.error(
    //                     err.response.data.msg
    //                         ? err.response.data.msg
    //                         : err.response.statusText
    //                 )
    //                 : toast.error("Network error");
    //         else toast.error("Unknown error");
    //     });
  }

  return (
    <React.Fragment>
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
          />
          <input
            type="text"
            placeholder="Untitled form"
            className="form-name"
            value={doc_name} />
          <IconButton><FolderOpenIcon className="form-header-icon" ></FolderOpenIcon></IconButton>
          <IconButton><StarBorderIcon className="form-header-icon" /></IconButton>
        </div>

        <div className="form-header-right">
          <IconButton>
            <ColorLensIcon className="form-header-icon" />
          </IconButton>

          <IconButton onClick={navigates}>
            <RemoveRedEyeIcon className="form-header-icon" />
          </IconButton>

          <IconButton>
            <SettingsIcon className="form-header-icon" />
          </IconButton>

          <IconButton
            onClick={() => {
              handleOpen();
            }}
          >
            <DeleteIcon className="form-header-icon" />
          </IconButton>

          <AlertDialog />

          <IconButton>
            <MoreVertIcon className="form-header-icon mode" />
          </IconButton>

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
      </div>
    </React.Fragment>
  );
}

export default FormHeader;
