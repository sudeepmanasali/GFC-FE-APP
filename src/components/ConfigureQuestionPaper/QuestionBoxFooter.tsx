import React from "react";
import "./QuestionUI.scss";
import { IconButton, Switch, Tooltip } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface PropsType {
  questionIndex: number,
  copyQuestion: Function,
  isRequired: boolean,
  deleteQuestion: Function,
  requiredQuestion: Function
};

export const QuestionBoxFooter: React.FC<PropsType> = ({ questionIndex, isRequired, copyQuestion, deleteQuestion, requiredQuestion }) => {
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
