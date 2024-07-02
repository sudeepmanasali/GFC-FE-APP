import React from "react";
import "./QuestionUI.scss";
import { FormControlLabel, Typography } from "@mui/material";
import { QUESTION_TYPES, Question } from "../../utils/constants";
import { isSelectionType } from "../../utils/util";

type optionType = { option: string };
type propsType = { questionIndex: number, showQuestionPaper: boolean, question: Question };

export const DisplayQuestion: React.FC<propsType> = ({ questionIndex, question, showQuestionPaper }) => {
  let IconMap = new Map();
  IconMap.set(QUESTION_TYPES.TEXT, "Short text answer");
  IconMap.set(QUESTION_TYPES.DATE, "DD/MM/YYYY");
  IconMap.set(QUESTION_TYPES.TIME, "HH:SS");

  return <div className="saved-questions">
    <Typography className="question-text">
      {(questionIndex + 1).toString() + ". " + question.question}
    </Typography>

    {isSelectionType(question.questionType as QUESTION_TYPES) && question.options.map((op: optionType, optIndex: number) => (
      <div key={optIndex}>
        <div className="option-box">
          <FormControlLabel className="form-control-label" disabled={!showQuestionPaper}
            control={
              <input type={question.questionType}
                name={questionIndex.toString()}
                placeholder={question.questionType}
                className="option-section-type-box" disabled={!showQuestionPaper} />
            }
            label={
              isSelectionType(question.questionType as QUESTION_TYPES) &&
              <Typography className="option-text-value">
                {question.options[optIndex].option}
              </Typography>
            }
          />
        </div>
      </div>
    ))}

    {
      !isSelectionType(question.questionType as QUESTION_TYPES) && ((
        <div className="option-box">
          <div className="form-control-label add-margin">
            <input type={question.questionType} className="option-input-box" placeholder={IconMap.get(question.questionType)} />
          </div>
        </div>
      ))
    }
  </div>
}
