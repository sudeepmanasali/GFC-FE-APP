import React from "react";
import "./QuestionUI.scss";
import { MenuItem, Select } from "@mui/material";
import { QUESTION_TYPES, Question } from "../../utils/constants";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ShortTextIcon from '@mui/icons-material/ShortText';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

type propsType = { questionIndex: number, updatedQuestionType: Function, question: Question };

export const SelectBox: React.FC<propsType> = ({ questionIndex, question, updatedQuestionType }) => {
  let menuItem = [QUESTION_TYPES.CHECKBOX, QUESTION_TYPES.RADIO, QUESTION_TYPES.TEXT, QUESTION_TYPES.DATE, QUESTION_TYPES.TIME];
  let IconMap = new Map();
  IconMap.set(QUESTION_TYPES.CHECKBOX, { icon: <CheckBoxIcon />, text: "Checkbox" });
  IconMap.set(QUESTION_TYPES.RADIO, { icon: <RadioButtonCheckedIcon />, text: "Multiple Choice" });
  IconMap.set(QUESTION_TYPES.TEXT, { icon: <ShortTextIcon />, text: "Short Text" });
  IconMap.set(QUESTION_TYPES.DATE, { icon: <CalendarMonthIcon />, text: "Date" });
  IconMap.set(QUESTION_TYPES.TIME, { icon: <AccessTimeIcon />, text: "Time" });

  return <Select className="select" value={question.questionType}
    onChange={(e) => { updatedQuestionType(questionIndex, e.target.value) }}>
    {
      menuItem.map((value: QUESTION_TYPES) => {
        return <MenuItem id="checkbox" value={value} >
          <div className="menu-item">{IconMap.get(value).icon} <span className="label">{IconMap.get(value).text}</span></div>
        </MenuItem>
      })
    }
  </Select>
}
