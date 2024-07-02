import { Question } from "../../utils/Question";
import { Tooltip, IconButton, Button } from "@mui/material";
import { QUESTION_TYPES } from "../../utils/constants";
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import "./QuestionUI.scss";
import { isSelectionType } from "../../utils/util";

interface PropsType {
  questionIndex: number,
  question: Question,
  addOption: Function,
  handleOptionValue: Function,
  removeOption: Function
};

export const OptionBox: React.FC<PropsType> = ({ questionIndex, question, handleOptionValue, addOption, removeOption }) => {

  let IconMap = new Map();
  IconMap.set(QUESTION_TYPES.TEXT, "Short text answer");
  IconMap.set(QUESTION_TYPES.DATE, "DD/MM/YYYY");
  IconMap.set(QUESTION_TYPES.TIME, "HH:SS");

  return <>
    {isSelectionType(question.questionType) && question?.options.length > 0 &&
      question.options.map((option, j) => (
        <div className="add-question-body" key={j}>
          {/* display if question type is selection type like radio / checkbox  */}
          {
            isSelectionType(question.questionType) && (<div className="option-box">
              <input
                readOnly
                className="question-text-input"
                type={question.questionType}
              />
              <input type="text" className="text-input" placeholder="option"
                onChange={(e) => {
                  handleOptionValue(e.target.value, questionIndex, j);
                }}
              />
              <div className="close-box">
                <Tooltip title="Add Image" placement="bottom">
                  <CropOriginalIcon className="icon" />
                </Tooltip>
                <Tooltip title="Remove">
                  <IconButton aria-label="delete" onClick={() => { removeOption(questionIndex, j) }} >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>)
          }
        </div>
      ))}

    {/* display if question type is not a selection type like radio / checkbox  */}
    {
      !isSelectionType(question.questionType) && ((
        <div className="add-question-body">
          <div className="option-box add-margin">
            <input type="text" className="text-input-box" placeholder={IconMap.get(question.questionType)} readOnly />
          </div>
        </div>
      ))
    }

    {/* display if question type is selection type like radio / checkbox  */}
    {question.options.length < 5 && isSelectionType(question.questionType) && (
      <div className="add-question-body">
        <div className="option-box">
          <input readOnly
            className="question_text_input"
            type={question.questionType}
          />
          <Button size="small" onClick={() => { addOption(questionIndex); }} className="add-option-btn">
            Add Option
          </Button>
        </div>
      </div>
    )}
  </>
}
