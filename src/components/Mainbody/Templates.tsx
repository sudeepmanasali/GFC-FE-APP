import React from "react";
import "./Templates.scss";
import blank from "../../assets/images/forms-blank-googlecolors.png";
import UnfoldMoreSharpIcon from '@mui/icons-material/UnfoldMoreSharp';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import { IconButton } from "@mui/material";
import useAxios from "../../utils/axios";
import { HTTP_METHODS, REQUEST_FAILURE_MESSAGES, REQUEST_IN_PROGRESS, REQUEST_SUCCESS_MESSAGES, REQUEST_URLS } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useDocumentsName } from "components/contexts/documents-context";
import { useAuth } from "components/contexts/auth-context";

// template documents displayed below the header in home page
export function Templates() {
  let { HttpRequestController, isRequestPending, handlePromiseRequest } = useAxios();
  let navigate = useNavigate();
  const { files, setFiles } = useDocumentsName();
  const { user } = useAuth();

  // default questions to create new document
  let defaultQuestions = [
    {
      question: "Question",
      questionType: "radio",
      answer: false,
      points: 0,
      options: [{ option: "Option 1" }],
      open: true,
      required: false
    },
  ];

  // method to create new document
  const sendRequestToCreateForm = async (): Promise<void> => {
    let res = await HttpRequestController(REQUEST_URLS.CREATE_NEW_DOCUMENT, HTTP_METHODS.POST, {
      documentName: "untitled-form",
      documentDescription: "Add Description",
      questions: defaultQuestions,
      createdByUserID: user.userId
    });
    if (res) {
      // add new document to files
      let updatedFilesArr = [...files, { ...res.document, _id: res.documentId }];
      setFiles(updatedFilesArr);

      // if form created successfully it will navigate to nextpage
      navigate(`/forms/${res?.documentId}`, { state: { edit: true } });
    }
  }

  // creates the new document with default name, description and questions
  const createform = (e: any): void => {
    e.preventDefault();
    handlePromiseRequest(sendRequestToCreateForm, REQUEST_IN_PROGRESS, REQUEST_SUCCESS_MESSAGES.DOCUMENT_CREATED_SUCCESSFULLY,
      REQUEST_FAILURE_MESSAGES.DOCUMENT_CREATION_FAILED);
  }

  return (
    <div className="template-section">
      <div className="actual-width">
        <div className="template-top">
          <div className="template_left">
            <p className="template-title">Start a new form</p>
          </div>
          <div className="template-right">
            <div className="gallery-button">
              Template gallery
              <UnfoldMoreSharpIcon fontSize="small" />
            </div>
            <IconButton>
              <MoreVertSharpIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
        <div className="template-body">
          <div className="card" onClick={!isRequestPending ? createform : () => { }}>
            <img src={blank} className="card-image" />
            <p className="title">Blank Form</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Templates);
