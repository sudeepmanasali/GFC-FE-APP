import React from "react";
import "./QuestionUI.scss";
import { Typography } from "@mui/material";
import { QUESTION_TYPES, Question } from "../../utils/constants";
import {
  CheckboxQuestion, DateQuestion, MultipleChoiceQuestion,
  ShortAnswerQuestion, TimeQuestion
} from "components/common/Formcontols";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type propsType = { questionIndex: number, showQuestionPaper: boolean, question: Question, onChange: Function };

export const DisplayQuestion: React.FC<propsType> = ({ questionIndex, question, showQuestionPaper, onChange }) => {
  return <div className="saved-questions">
    <Typography className="question-text">
      {(questionIndex + 1).toString() + ". " + question.question}
    </Typography>
    <div className="display-options">
      <DisplayOption question={question} showQuestionPaper={showQuestionPaper} onChange={onChange} />
      {
        question.required && showQuestionPaper &&
        <div className="error-text">
          <ErrorOutlineIcon fontSize="small" style={{ marginRight: 12 }} />
          <span> This is a required question</span>
        </div>
      }
    </div>
  </div>
}

const DisplayOption: React.FC<any> = ({ question, showQuestionPaper, onChange }) => {
  switch (question.questionType) {
    case QUESTION_TYPES.RADIO: {
      return <MultipleChoiceQuestion question={question} options={question.options} onChange={onChange} />
    }
    case QUESTION_TYPES.CHECKBOX: {
      return <CheckboxQuestion question={question} options={question.options} onChange={onChange} />
    }
    case QUESTION_TYPES.DATE: {
      return <DateQuestion question={question} onChange={onChange} />
    }
    case QUESTION_TYPES.TIME: {
      return <TimeQuestion question={question} onChange={onChange} />
    }
    case QUESTION_TYPES.TEXT: {
      return <ShortAnswerQuestion question={question} onChange={onChange}
        showQuestionPaper={showQuestionPaper} />
    }
    default: {
      return <div></div>
    }
  }
}
