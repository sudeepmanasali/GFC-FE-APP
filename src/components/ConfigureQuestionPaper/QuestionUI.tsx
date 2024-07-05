import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateIcon from '@mui/icons-material/Create';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Accordion, Button, Tooltip } from "@mui/material";
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { Question } from "../../utils/Question";
import useAxios from '../../utils/axios';
import { HTTP_METHODS, QUESTION_ACTION_TYPES, REQUEST_URLS } from "../../utils/constants";
import { getCurrentDateTime } from '../../utils/util';
import { DisplayQuestion } from './Displayquestion';
import { OptionBox } from './OptionBox';
import { QuestionBoxFooter } from './QuestionBoxFooter';
import "./QuestionUI.scss";
import { SelectBox } from './SelectBox';
import { useDocument } from 'components/contexts/questions-context';

export function QuestionForm() {
  const [yoffset, setYOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  let params = useParams();
  let HttpRequestController = useAxios();
  let { questions, dispatch, currentFocusedQuestionId, documentName, documentDescription, viewDocument
  } = useDocument();

  useEffect(() => {
    if (viewDocument) {
      closeAllExpandedQuestion();
    }
  }, [viewDocument]);

  useEffect(() => {
    updateToolBoxPosition();
  }, [currentFocusedQuestionId, questions]);

  const updateDocument = async (): Promise<void> => {
    let payload = {
      _id: params.documentId,
      documentName,
      documentDescription,
      questions,
      updatedOn: getCurrentDateTime(),
    }
    await HttpRequestController(REQUEST_URLS.UPDATE_DOCUMENT, HTTP_METHODS.PUT, payload);
    toast.success("Questions saved successfully");
  }

  const isElementBoxVisible = (): boolean => {
    let elementRect = document.getElementById(currentFocusedQuestionId)?.getBoundingClientRect() || { top: 0, bottom: 0 };
    let containerRect = document.getElementsByClassName('question-form')[0]?.getBoundingClientRect();
    return elementRect?.top >= containerRect?.top && elementRect.bottom <= containerRect.bottom;
  }

  // Function to handle scroll event
  const handleScroll = (event: any) => {
    setTimeout(() => {
      const isVisible = isElementBoxVisible();
      if (isVisible) {
        updateToolBoxPosition();
      } else {
        setYOffset(event.target.scrollTop);
      }
    }, 300);
  };

  // updates tool box position when new question box is added
  const updateToolBoxPosition = (): void => {
    setTimeout(() => {
      if (!isElementBoxVisible()) {
        document.getElementById(currentFocusedQuestionId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      if (isElementBoxVisible()) {
        const accordionRect = document.getElementById(currentFocusedQuestionId)?.getBoundingClientRect();
        if (accordionRect) {
          const scrollTop = document.getElementsByClassName('question-form')[0].scrollTop;
          let targetTopRelativeToDiv = accordionRect.top - 120 + scrollTop;
          setYOffset(targetTopRelativeToDiv);
        }
      }
    }, 300);
  }

  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }
    let itemgg = [...questions];
    const itemF = reorder(
      itemgg,
      result.source.index,
      result.destination.index
    );
    dispatch({
      type: QUESTION_ACTION_TYPES.REORDER_QUESTIONS,
      payload: {
        questions: itemF as Question[]
      }
    });
    toast.success('Questions swapped', {
      position: "bottom-right"
    });
  }

  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const closeAllExpandedQuestion = (): void => {
    dispatch({ type: QUESTION_ACTION_TYPES.CLOSE_EXPANDED_QUESTIONS });
  }

  const handleExpand = (questionIndex: number): void => {
    dispatch({
      type: QUESTION_ACTION_TYPES.EXPAND_QUESTION,
      payload: { questionIndex }
    });
  }

  const updateQuestion = (question: string, questionIndex: number): void => {
    dispatch({
      type: QUESTION_ACTION_TYPES.UPDATE_QUESTION,
      payload: { questionIndex, questionText: question }
    });
  }

  const addQuestionTemplate = (): void => {
    closeAllExpandedQuestion();
    dispatch({ type: QUESTION_ACTION_TYPES.ADD_NEW_QUESTION });
    toast.success('Question added', {
      position: "bottom-right"
    });
  }


  const displayQuestions = () => {
    return questions.map((question: Question, i: any) => {
      return <Draggable key={question._id} draggableId={question._id} index={i} isDragDisabled={viewDocument}>
        {(provided) => (
          <div id={question._id} ref={provided.innerRef}  {...provided.draggableProps} {...provided.dragHandleProps}>
            <div>
              <div className={viewDocument ? "question-container add-margin" : "question-container"}>
                {
                  !viewDocument && (
                    <div className="drag-indicator-box">
                      <DragIndicatorIcon className="icon" fontSize="small" />
                    </div>
                  )
                }
                <Accordion onChange={() => {
                  if (!viewDocument) {
                    handleExpand(i);
                  }
                }} expanded={questions[i].open} className={questions[i].open ? "MuiAccordion-root add-border" : "MuiAccordion-root"}>
                  <AccordionSummary aria-controls="panel1-content" id="panel1-header">
                    {(!questions[i].open) && (
                      <DisplayQuestion questionIndex={i} question={question}
                        showQuestionPaper={viewDocument} />
                    )}
                  </AccordionSummary>
                  <div className="question-box">
                    <AccordionDetails className="add-question">
                      <div>
                        <div className="add-question-top">
                          <textarea className="question"
                            placeholder="Question" value={question.question} onChange={(e) => { updateQuestion(e.target.value, i) }} />
                          {/* selection box to select question type  */}
                          <SelectBox questionIndex={i} question={question} />
                        </div>
                        {/* adding options */}
                        <OptionBox question={question} questionIndex={i} />
                        {/* question box footer with action buttons  */}
                        <QuestionBoxFooter isRequired={question.required} questionIndex={i} />
                      </div>
                    </AccordionDetails>
                  </div>
                </Accordion>
              </div>
            </div>
          </div >
        )
        }
      </Draggable >
    })
  }

  return (
    <div>
      <div className={viewDocument ? "question-paper-full-height question-form" : "question-form"} id="question-form" onScroll={handleScroll}>
        <div className="section">
          <div className="question-title-section">
            <div className="question-form-top">
              <input
                type="text"
                className="question-form-top-name"
                placeholder="Untitled form"
                value={documentName}
                onChange={(e) => {
                  dispatch({ type: QUESTION_ACTION_TYPES.UPDATE_DOCUMENT_NAME, payload: { documentName: e.target.value } });
                }}
                readOnly={viewDocument}
              />
              <input
                type="text"
                className="question-form-top-desc"
                placeholder="Document description"
                value={documentDescription}
                onChange={(e) => {
                  dispatch({ type: QUESTION_ACTION_TYPES.UPDATE_DOCUMENT_DESCRIPTION, payload: { documentDescription: e.target.value } });
                }}
                readOnly={viewDocument}
              />
            </div>
          </div>
          {
            questions && (<DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {displayQuestions()}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            )
          }

          <div className="save-form">
            <Button
              variant="contained"
              color="primary"
              onClick={!viewDocument ? updateDocument : () => { }} >
              {viewDocument ? "Submit" : "Save"}
            </Button>
          </div>
        </div>
        {
          !loading && !viewDocument && (<div className="question-edit" style={{ top: `${yoffset}px` }}>
            <Tooltip title="Add question" placement="right">
              <AddCircleOutlineIcon className="edit" onClick={() => addQuestionTemplate()} />
            </Tooltip>
            <OndemandVideoIcon className="edit" />
            <CropOriginalIcon className="edit" />
            <TextFieldsIcon className="edit" />
          </div>)
        }
      </div>
      {/* display this edit icon when user is viewing the document */}
      {viewDocument && (
        <Tooltip title="Edit">
          <CreateIcon className="edit-question-paper-icon" onClick={() => dispatch({
            type: QUESTION_ACTION_TYPES.VIEW_DOCUMENT
          })} />
        </Tooltip>)
      }
    </div >
  )
}
