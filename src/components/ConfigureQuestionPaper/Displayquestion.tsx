import React, { memo } from "react";
import "./QuestionUI.scss";
import { Typography } from "@mui/material";
import { QUESTION_TYPES, Question } from "../../utils/constants";
import {
  CheckboxQuestion, DateQuestion, MultipleChoiceQuestion,
  ShortAnswerQuestion, TimeQuestion
} from "components/common/Formcontols";

type propsType = { questionIndex: number, showQuestionPaper: boolean, question: Question, onChange: Function };

export const DisplayQuestion: React.FC<propsType> = memo(({ questionIndex, question, showQuestionPaper, onChange }) => {
  return <div className="saved-questions">
    <Typography className="question-text">
      {(questionIndex + 1).toString() + ". " + question.question} {(question.required) && <span className="required-star">*</span>}
    </Typography>
    <div className="display-options">
      <DisplayOption question={question} showQuestionPaper={showQuestionPaper} onChange={onChange} />
    </div>
  </div>
});

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
