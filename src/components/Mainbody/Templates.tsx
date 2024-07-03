import React, { useState } from "react";
import "./Templates.scss";
import blank from "../../assets/images/forms-blank-googlecolors.png";
import UnfoldMoreSharpIcon from '@mui/icons-material/UnfoldMoreSharp';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import { IconButton } from "@mui/material";
import useAxios from "../../utils/axios";
import { HTTP_METHODS, REQUEST_URLS } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { getCurrentDateTime } from "../../utils/util";
import getUserInfo from "../../utils/auth-validate";

export function Templates() {
  let HttpRequestController = useAxios();
  let navigate = useNavigate();
  let { user } = getUserInfo();

  const createform = async (e: any): Promise<void> => {
    e.preventDefault();
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

    let res = await HttpRequestController(REQUEST_URLS.CREATE_NEW_DOCUMENT, HTTP_METHODS.POST, {
      documentName: "untitled-form",
      documentDescription: "Add Description",
      questions: defaultQuestions,
      createdOn: getCurrentDateTime(),
      createdBy: user.username,
      updatedOn: getCurrentDateTime(),
    });
    if (res) {
      navigate(`/question-paper/${res?.documentId}`);
    }
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
          <div className="card" onClick={createform}>
            <img src={blank} className="card-image" />
            <p className="title">Blank Form</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Templates);
