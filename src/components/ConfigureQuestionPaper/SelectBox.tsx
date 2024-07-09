import React from "react";
import "./QuestionUI.scss";
import { MenuItem, Select } from "@mui/material";
import { QUESTION_ACTION_TYPES, QUESTION_TYPES, Question } from "../../utils/constants";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ShortTextIcon from '@mui/icons-material/ShortText';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useDocument } from "components/contexts/questions-context";
import toast from "react-hot-toast";

type propsType = { questionIndex: number, question: Question };

export const SelectBox: React.FC<propsType> = ({ questionIndex, question }) => {
  let { dispatch } = useDocument();
  let menuItem = [QUESTION_TYPES.CHECKBOX, QUESTION_TYPES.RADIO, QUESTION_TYPES.TEXT, QUESTION_TYPES.DATE, QUESTION_TYPES.TIME];
  let IconMap = new Map();
  IconMap.set(QUESTION_TYPES.CHECKBOX, { icon: <CheckBoxIcon />, text: "Checkbox" });
  IconMap.set(QUESTION_TYPES.RADIO, { icon: <RadioButtonCheckedIcon />, text: "Multiple Choice" });
  IconMap.set(QUESTION_TYPES.TEXT, { icon: <ShortTextIcon />, text: "Short Text" });
  IconMap.set(QUESTION_TYPES.DATE, { icon: <CalendarMonthIcon />, text: "Date" });
  IconMap.set(QUESTION_TYPES.TIME, { icon: <AccessTimeIcon />, text: "Time" });


  const updatedQuestionType = (type: any): void => {
    dispatch({
      type: QUESTION_ACTION_TYPES.UPDATE_QUESTION_TYPE,
      payload: { questionIndex, queType: type }
    });
    toast.success('Question type updated', {
      position: "bottom-right"
    });
  }

  return <Select className="select" value={question.questionType} color="success"
    onChange={(e) => { updatedQuestionType(e.target.value) }}>
    {
      menuItem.map((value: QUESTION_TYPES, index: number) => {
        return <MenuItem id="checkbox" value={value} color="success" key={index}>
          <div className="menu-item">{IconMap.get(value).icon} <span className="label">{IconMap.get(value).text}</span></div>
        </MenuItem>
      })
    }
  </Select>
}
