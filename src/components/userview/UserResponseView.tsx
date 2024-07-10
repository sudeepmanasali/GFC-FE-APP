
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "utils/axios";
import { REQUEST_URLS, HTTP_METHODS, QUESTION_TYPES, INTERNAL_SERVER_ERROR, LOADING, REQUEST_SUCCESS_MESSAGES } from "utils/constants";
import { Question } from "utils/Question";
import "./UserResponseStyles.scss";
import { Tooltip, Typography } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { MultipleChoiceQuestion, CheckboxQuestion, DateQuestion, TimeQuestion, ShortAnswerQuestion } from "components/common/Formcontols";

export const UserResponseView = () => {
  const params = useParams();
  const { HttpRequestController, handlePromiseRequest } = useAxios();
  const [formData, setFormData] = useState<any>();
  const [formResponse, setFormResponse] = useState<any>();
  const [answers, setAnswers] = useState<any>([]);
  const navigate = useNavigate();


  const loadDocument = async () => {
    let { document } = await HttpRequestController(REQUEST_URLS.GET_DOCUMENT + `/${params.documentId}`, HTTP_METHODS.GET);
    setFormData(document);
  }

  useEffect(() => {
    handlePromiseRequest(loadDocument, LOADING, REQUEST_SUCCESS_MESSAGES.FORMS_LOADED_SUCCESSFULLY, INTERNAL_SERVER_ERROR);
  }, []);

  const loadResponse = async () => {
    let { formResponses } = await HttpRequestController(REQUEST_URLS.USER_RESPONSE + `/${params.userId}` + `/${params.documentId}`,
      HTTP_METHODS.GET);
    setFormResponse([formResponses[0]]);
    setAnswers({
      answers: formResponses[0].answers
    });
  }

  useEffect(() => {
    handlePromiseRequest(loadResponse, LOADING, REQUEST_SUCCESS_MESSAGES.RESPONSE_LOADED_SUCCESSFULLY, INTERNAL_SERVER_ERROR);
  }, []);

  return <div className="response-form">
    {
      formResponse && formData && (<div className="response-container">
        <div className="section">
          <div className="response-box add-border-top">
            <div>
              <input
                type="text"
                className="form-top-name"
                placeholder="Untitled form"
                value={formData?.documentName}

                readOnly={true}
              />
              <input
                type="text"
                className="form-top-desc"
                placeholder="Document description"
                value={formData?.documentDescription}
                readOnly={true}
              />
            </div>
          </div>
          {
            formData?.questions?.map((question: Question, index: number) => {
              return <div className="response-box">
                <div className="saved-questions">
                  <Typography>
                    {(index + 1).toString() + ". " + question.question}
                  </Typography>
                  <div className="display-options">
                    <DisplayOption question={question} showQuestionPaper={false} onChange={() => { }} answered={answers ? answers.answers[question._id] : undefined} />
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </div>)
    }


    <div className="back-button">
      <Tooltip title="Go Back">
        <ArrowBackIosNewIcon className="edit-question-paper-icon" onClick={() => { navigate(-1) }} />
      </Tooltip>
    </div>
  </div>
}

const DisplayOption: React.FC<any> = ({ question, showQuestionPaper, onChange, answered }) => {
  switch (question.questionType) {
    case QUESTION_TYPES.RADIO: {
      return <MultipleChoiceQuestion question={question} options={question.options} onChange={onChange} answered={answered} />
    }
    case QUESTION_TYPES.CHECKBOX: {
      return <CheckboxQuestion question={question} options={question.options} onChange={onChange} answered={answered} />
    }
    case QUESTION_TYPES.DATE: {
      return <DateQuestion question={question} onChange={onChange} answered={answered} />
    }
    case QUESTION_TYPES.TIME: {
      return <TimeQuestion question={question} onChange={onChange} answered={answered} />
    }
    case QUESTION_TYPES.TEXT: {
      return <ShortAnswerQuestion question={question} onChange={onChange}
        showQuestionPaper={showQuestionPaper} answered={answered} />
    }
    default: {
      return <div></div>
    }
  }
}
