import React, { useState, useEffect } from "react";
import "./Question_form.css";

import CropOriginalIcon from "@material-ui/icons/CropOriginal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ToastContainer, toast } from "react-toastify";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import ShortTextIcon from "@material-ui/icons/ShortText";
import SubjectIcon from "@material-ui/icons/Subject";
import { useHistory } from "react-router-dom";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import { BsTrash } from "react-icons/bs";
import { IconButton } from "@material-ui/core";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import TextFieldsIcon from "@material-ui/icons/TextFields";

import { BsFileText } from "react-icons/bs";
import { Paper, Typography } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";
import { FcRightUp } from "react-icons/fc";
import CloseIcon from "@material-ui/icons/Close";
import Radio from "@material-ui/core/Radio";

import FormControlLabel from "@material-ui/core/FormControlLabel";

import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import { useParams } from "react-router";
import axios from "axios";
import { validateTokenAge } from "./AuthValidate";

function Question_form() {
  const [{}, dispatch] = useStateValue();
  const [questions, setQuestions] = useState([]);
  const [documentName, setDocName] = useState("untitled Document");

  const [documentDescription, setDocDesc] = useState("Add Description");

  const [questionType, setType] = useState("radio");
  // const [questionRequired,setRequired] =useState("true");
  let { id } = useParams();


  function questionsUI() {
    return questions.map((ques, i) => (
      <Draggable key={i} draggableId={i + "id"} index={i}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div>
              <div style={{ marginBottom: "0px" }}>
                <div style={{ width: "100%", marginBottom: "0px" }}>
                  <DragIndicatorIcon
                    style={{
                      transform: "rotate(-90deg)",
                      color: "#DAE0E2",
                      position: "relative",
                      left: "300px",
                    }}
                    fontSize="small"
                  />
                </div>

                <Accordion
                  onChange={() => {
                    handleExpand(i);
                  }}
                  expanded={questions[i].open}
                  className={questions[i].open ? "add_border" : ""}
                >
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    elevation={1}
                    style={{ width: "100%" }}
                  >
                    {!questions[i].open ? (
                      <div className="saved_questions">
                        <Typography
                          style={{
                            fontSize: "15px",
                            fontWeight: "400",
                            letterSpacing: ".1px",
                            lineHeight: "24px",
                            paddingBottom: "8px",
                          }}
                        >
                          {i + 1}. {ques.questionText}
                        </Typography>

                        {ques.options.map((op, j) => (
                          <div key={j}>
                            <div style={{ display: "flex" }}>
                              <FormControlLabel
                                style={{
                                  marginLeft: "5px",
                                  marginBottom: "5px",
                                }}
                                disabled
                                control={
                                  <input
                                    type={ques.questionType}
                                    color="primary"
                                    style={{ marginRight: "3px" }}
                                    required={ques.type}
                                  />
                                }
                                label={
                                  <Typography
                                    style={{
                                      fontFamily: " Roboto,Arial,sans-serif",
                                      fontSize: " 13px",
                                      fontWeight: "400",
                                      letterSpacing: ".2px",
                                      lineHeight: "20px",
                                      color: "#202124",
                                    }}
                                  >
                                    {ques.options[j].optionText}
                                  </Typography>
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </AccordionSummary>
                  <div className="question_boxes">
                    {!ques.answer ? (
                      <AccordionDetails className="add_question">
                        <div>
                          <div className="add_question_top">
                          </div>

                          {ques?.options.length > 0 &&
                            ques.options.map((op, j) => (
                              <div className="add_question_body" key={j}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {ques.questionType != "text" ? (
                                    <input
                                      className="question_text_input"
                                      type={ques.questionType}
                                      style={{ marginRight: "10px" }}
                                    />
                                  ) : (
                                    <ShortTextIcon
                                      style={{ marginRight: "10px" }}
                                    />
                                  )}

                                  <input
                                    type="text"
                                    className="text_input"
                                    placeholder="option"
                                    value={ques.options[j].optionText}
                                    onChange={(e) => {
                                      handleOptionValue(e.target.value, i, j);
                                    }}
                                  ></input>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <CropOriginalIcon
                                    style={{ color: "#5f6368" }}
                                  />

                                  <IconButton
                                    aria-label="delete"
                                    onClick={() => {
                                      removeOption(i, j);
                                    }}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </div>
                              </div>
                            ))}

                          {ques.options.length < 5 ? (
                            <div className="add_question_body">
                              <FormControlLabel
                                disabled
                                control={
                                  ques.questionType != "text" ? (
                                    <input
                                      type={ques.questionType}
                                      color="primary"
                                      inputProps={{
                                        "aria-label": "secondary checkbox",
                                      }}
                                      style={{
                                        marginLeft: "10px",
                                        marginRight: "10px",
                                      }}
                                      disabled
                                    />
                                  ) : (
                                    <ShortTextIcon
                                      style={{ marginRight: "10px" }}
                                    />
                                  )
                                }
                                label={
                                  <>
                                    <input
                                      type="text"
                                      className="text_input"
                                      style={{
                                        fontSize: "13px",
                                        width: "60px",
                                      }}
                                      placeholder="Add other"
                                    ></input>
                                    <Button
                                      size="small"
                                      onClick={() => {
                                        addOption(i);
                                      }}
                                      style={{
                                        textTransform: "none",
                                        color: "#4285f4",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      Add Option
                                    </Button>
                                  </>
                                }
                              />
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="add_footer">
                            <div className="add_question_bottom_left">
                              <Button
                                className="leftPadding"
                                size="small"
                                onClick={() => {
                                  addAnswer(i);
                                }}
                                style={{
                                  textTransform: "none",
                                  color: "#4285f4",
                                  fontSize: "13px",
                                  fontWeight: "600",
                                }}
                              >
                                {" "}
                                <FcRightUp
                                  style={{
                                    border: "2px solid #4285f4",
                                    padding: "2px",
                                    marginRight: "8px",
                                  }}
                                />{" "}
                                Answer key
                              </Button>
                            </div>

                            <div className="add_question_bottom">
                              <IconButton
                                aria-label="Copy"
                                data-toggle="tooltip"
                                data-placement="top"
                                title={"Copy question"}
                                onClick={() => {
                                  // copyQuestion(i);
                                }}
                              >
                                <FilterNoneIcon />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                data-toggle="tooltip"
                                data-placement="top"
                                title={"Delete question"}
                                onClick={() => {
                                  deleteQuestion(i);
                                }}
                              >
                                <BsTrash />
                              </IconButton>
                              <div>
                                <span
                                  style={{ color: "#5f6368", fontSize: "13px" }}
                                >
                                  Required{" "}
                                </span>{" "}
                                <Switch
                                  name="checkedA"
                                  color="primary"
                                  checked={ques.required}
                                  onClick={() => {
                                    requiredQuestion(i);
                                  }}
                                />
                              </div>

                              <IconButton>
                                <MoreVertIcon />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      </AccordionDetails>
                    ) : (
                      <AccordionDetails className="add_question">
                        <div className="top_header">Choose Correct Answer</div>
                        <div>
                          <div className="add_question_top">
                            <input
                              type="text"
                              className="question "
                              placeholder="Question"
                              value={ques.questionText}
                              onChange={(e) => {
                                handleQuestionValue(e.target.value, i);
                              }}
                              disabled
                            />
                            <input
                              type="number"
                              className="points"
                              min="0"
                              step="1"
                              placeholder="0"
                              onChange={(e) => {
                                setOptionPoints(e.target.value, i);
                              }}
                            />
                          </div>

                          {ques.options.map((op, j) => (
                            <div
                              className="add_question_body"
                              key={j}
                              style={{
                                marginLeft: "8px",
                                marginBottom: "10px",
                                marginTop: "5px",
                              }}
                            >
                              <div key={j}>
                                <div style={{ display: "flex" }} className="">
                                  <div className="form-check">
                                    <label
                                      style={{ fontSize: "13px" }}
                                      onClick={() => {
                                        setOptionAnswer(
                                          ques.options[j].optionText,
                                          i
                                        );
                                      }}
                                    >
                                      {ques.questionType != "text" ? (
                                        <input
                                          type={ques.questionType}
                                          name={ques.questionText}
                                          value="option3"
                                          className="form-check-input"
                                          required={ques.required}
                                          style={{
                                            marginRight: "10px",
                                            marginBottom: "10px",
                                            marginTop: "5px",
                                          }}
                                        />
                                      ) : (
                                        <ShortTextIcon
                                          style={{ marginRight: "10px" }}
                                        />
                                      )}

                                      {ques.options[j].optionText}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="add_question_body">
                            <Button
                              size="small"
                              style={{
                                textTransform: "none",
                                color: "#4285f4",
                                fontSize: "13px",
                                fontWeight: "600",
                              }}
                            >
                              {" "}
                              <BsFileText
                                style={{
                                  fontSize: "20px",
                                  marginRight: "8px",
                                }}
                              />
                              Add Answer Feedback
                            </Button>
                          </div>

                          <div className="add_question_bottom">
                            <Button
                              variant="outlined"
                              color="primary"
                              style={{
                                textTransform: "none",
                                color: "#4285f4",
                                fontSize: "12px",
                                marginTop: "12px",
                                fontWeight: "600",
                              }}
                              onClick={() => {
                                doneAnswer(i);
                              }}
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </AccordionDetails>
                    )}
                    {!ques.answer ? (
                      <div className="question_edit">
                        <AddCircleOutlineIcon
                          data-toggle="tooltip"
                          data-placement="top"
                          title={"Add question"}
                          onClick={addMoreQuestionField}
                          className="edit"
                        />
                        <OndemandVideoIcon className="edit" />
                        <CropOriginalIcon className="edit" />
                        <TextFieldsIcon className="edit" />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </Accordion>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    ));
  }

  return (
    <div>
      <div className="question_form">
        <br></br>
        <div className="section">
          <div className="question_title_section">
            <div className="question_form_top">
              <input
                type="text"
                className="question_form_top_name"
                style={{ color: "black" }}
                placeholder={documentName ? documentName : "Untitled form"}
                value={documentName ? documentName : "Untitled form"}
                onChange={(e) => {
                  setDocName(e.target.value);
                }}
              ></input>
              <input
                type="text"
                className="question_form_top_desc"
                placeholder={
                  documentDescription
                    ? documentDescription
                    : "Document description"
                }
                value={documentDescription}
                onChange={(e) => {
                  setDocDesc(e.target.value);
                }}
              ></input>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {questionsUI()}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="save_form">
            <Button
              variant="contained"
              color="primary"
              onClick={commitToDB}
              style={{ fontSize: "14px" }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question_form;
