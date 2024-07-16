import { Question } from "../../utils/Question";
import { Tooltip, IconButton, Button } from "@mui/material";
import { QUESTION_ACTION_TYPES, QUESTION_TYPES } from "../../utils/constants";
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import CloseIcon from '@mui/icons-material/Close';
import React, { memo } from "react";
import "./QuestionUI.scss";
import { isSelectionType } from "../../utils/util";
import { useDocument } from "components/contexts/questions-context";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface PropsType {
  questionIndex: number,
  question: Question
};

export const OptionBox: React.FC<PropsType> = memo(({ questionIndex, question }) => {

  let { dispatch } = useDocument();
  let IconMap = new Map();
  IconMap.set(QUESTION_TYPES.TEXT, "Short text answer");
  IconMap.set(QUESTION_TYPES.DATE, "DD/MM/YYYY");
  IconMap.set(QUESTION_TYPES.TIME, "HH:SS");

  const addOption = (questionIndex: number): void => {
    dispatch({
      type: QUESTION_ACTION_TYPES.ADD_NEW_OPTION,
      payload: { questionIndex }
    });
  }

  const removeOption = (questionIndex: number, optionIndex: number): void => {
    dispatch({
      type: QUESTION_ACTION_TYPES.REMOVE_OPTION,
      payload: { questionIndex, optionIndex }
    });
  }

  const handleOptionValue = (optionValue: string, questionIndex: number, optionIndex: number): void => {
    dispatch({
      type: QUESTION_ACTION_TYPES.HANDLE_OPTION_VALUE,
      payload: { questionIndex, optionIndex, optionValue }
    });
  }

  return <>
    {isSelectionType(question.questionType) && question?.options.length > 0 &&
      question.options.map((option, j) => (
        <div className="add-question-body" key={j}>
          {/* display if question type is selection type like radio / checkbox  */}
          {
            isSelectionType(question.questionType) && (<div className="option-box">
              {
                question.questionType === QUESTION_TYPES.RADIO && <RadioButtonUncheckedIcon fontSize="small" />
              }
              {
                question.questionType === QUESTION_TYPES.CHECKBOX && <CheckBoxOutlineBlankIcon fontSize="small" />
              }
              <input type="text" className="text-input" placeholder="option" value={option.option}
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
          {
            question.questionType === QUESTION_TYPES.RADIO && <RadioButtonUncheckedIcon fontSize="small" />
          }
          {
            question.questionType === QUESTION_TYPES.CHECKBOX && <CheckBoxOutlineBlankIcon fontSize="small" />
          }
          <Button size="small" onClick={() => { addOption(questionIndex); }} className="add-option-btn">
            Add Option
          </Button>
        </div>
      </div>
    )}
  </>
});
