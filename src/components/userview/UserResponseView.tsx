
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "utils/axios";
import { REQUEST_URLS, HTTP_METHODS, QUESTION_TYPES, INTERNAL_SERVER_ERROR, LOADING, REQUEST_SUCCESS_MESSAGES } from "utils/constants";
import { Question } from "utils/Question";
import "./UserResponseStyles.scss";
import { Typography } from "@mui/material";
import { MultipleChoiceQuestion, CheckboxQuestion, DateQuestion, TimeQuestion, ShortAnswerQuestion } from "components/common/Formcontols";

export const UserResponseView: React.FC<any> = ({ userId }) => {
  const params = useParams();
  const { HttpRequestController, handlePromiseRequest } = useAxios();
  const [formData, setFormData] = useState<any>();
  const [answers, setAnswers] = useState<any>({});

  const loadResponse = async () => {
    let formResponse = await HttpRequestController(REQUEST_URLS.USER_RESPONSE + `/${userId}` + `/${params.documentId}`,
      HTTP_METHODS.GET);

    setFormData({
      questions: formResponse.questions,
      documentName: formResponse.documentName,
      documentDescription: formResponse.documentDescription
    });

    setAnswers({
      answers: formResponse.answers
    });
  }

  // loads the user reponse
  useEffect(() => {
    handlePromiseRequest(loadResponse, LOADING, REQUEST_SUCCESS_MESSAGES.RESPONSE_LOADED_SUCCESSFULLY, INTERNAL_SERVER_ERROR);
  }, []);

  return <div className="response-form">
    {
      formData && (<div className="response-container">
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
                  <Typography className="question-text">
                    {((index + 1).toString() + ". " + question.question).trim()}
                  </Typography>
                  <DisplayOption question={question} showQuestionPaper={false} onChange={() => { }} answered={Object.keys(answers).length > 0 && answers.answers ? answers.answers[question._id] : undefined} />
                </div>
              </div>
            })
          }
        </div>
      </div>)
    }
  </div>
}

// displaying the options and the response given by the user
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
