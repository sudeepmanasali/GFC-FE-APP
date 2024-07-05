import React from "react";
import "./QuestionUI.scss";
import { IconButton, Switch, Tooltip } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDocument } from "components/contexts/questions-context";
import { QUESTION_ACTION_TYPES } from "utils/constants";
import toast from "react-hot-toast";

interface PropsType {
  questionIndex: number,
  isRequired: boolean
};

export const QuestionBoxFooter: React.FC<PropsType> = ({ questionIndex, isRequired }) => {

  let { dispatch } = useDocument();
  const copyQuestion = (questionIndex: number): void => {
    dispatch({
      type: QUESTION_ACTION_TYPES.CLOSE_EXPANDED_QUESTIONS
    });
    dispatch({
      type: QUESTION_ACTION_TYPES.COPY_QUESTION,
      payload: { questionIndex }
    });
    toast.success('Question copied', {
      position: "bottom-right"
    });
  }

  const requiredQuestion = (questionIndex: number): void => {
    dispatch({
      type: QUESTION_ACTION_TYPES.TOGGLE_REQUIRED,
      payload: { questionIndex }
    });
  }

  const deleteQuestion = (questionIndex: number): void => {
    dispatch({
      type: QUESTION_ACTION_TYPES.CLOSE_EXPANDED_QUESTIONS
    });
    dispatch({
      type: QUESTION_ACTION_TYPES.DELETE_QUESTION,
      payload: { questionIndex }
    });
    toast.success('Question deleted', {
      position: "bottom-right"
    });
  }


  return <div className="question-footer">
    <div className="question-bottom">
      <Tooltip title="Duplicate" placement="bottom">
        <IconButton
          onClick={() => { copyQuestion(questionIndex) }}>
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete" placement="bottom">
        <IconButton
          onClick={() => { deleteQuestion(questionIndex) }}>
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>
      <div>
        <span className="required">
          Required
        </span>
        <Switch
          name="checkedA"
          color="primary"
          checked={isRequired}
          onClick={() => { requiredQuestion(questionIndex) }}
        />
      </div>
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    </div>
  </div>
}
