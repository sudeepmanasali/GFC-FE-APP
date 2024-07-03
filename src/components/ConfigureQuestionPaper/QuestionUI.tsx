import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateIcon from '@mui/icons-material/Create';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { Accordion, Button, Tooltip } from "@mui/material";
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { Question } from "../../utils/Question";
import useAxios from '../../utils/axios';
import { HTTP_METHODS, REQUEST_URLS } from "../../utils/constants";
import { getCurrentDateTime } from '../../utils/util';
import { useQuestionPaper } from '../contexts/questionPaperContext';
import { DisplayQuestion } from './Displayquestion';
import { OptionBox } from './OptionBox';
import { QuestionBoxFooter } from './QuestionBoxFooter';
import "./QuestionUI.scss";
import { SelectBox } from './SelectBox';

export function QuestionForm() {
  const { questionPaper, setQuestionPaper } = useQuestionPaper();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [yoffset, setYOffset] = useState(0);
  const [currQueIdx, setCurQueIdx] = useState(0);
  const [documentName, setDocName] = useState("untitled Document");
  const [documentDescription, setDocDesc] = useState("Add Description");
  const inputRefs = useRef<HTMLInputElement[] | any>([]);
  const divRef = useRef<HTMLInputElement[] | any>(null);
  let params = useParams();
  let HttpRequestController = useAxios();

  useEffect(() => {
    toast.promise(
      getAllQuestions(),
      {
        loading: 'Saving...',
        success: 'Questions loaded successfully',
        error: 'Internal Server Error'
      }
    );
    setYOffset(172);
  }, []);

  useEffect(() => {
    if (questionPaper.showQuestionPaper) {
      closeAllExpandedQuestion();
    }
  }, [questionPaper]);

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

  const getAllQuestions = async (): Promise<void> => {
    let { document } = await HttpRequestController(REQUEST_URLS.GET_DOCUMENT + `/${params.documentId}`, HTTP_METHODS.GET);
    setDocDesc(document.documentDescription);
    setDocName(document.documentName);
    let documentQuestions = document.questions.map((question: Question) => {
      return new Question(question);
    });
    setQuestions(documentQuestions);
    setQuestionPaper({
      ...questionPaper,
      documentName: document.documentName
    });
  }

  const isElementBoxVisible = (questionIndex?: number): boolean => {
    let focusedBox = questionIndex !== undefined ? questionIndex : currQueIdx;
    let elementRect = document.getElementsByClassName('MuiAccordion-root')[focusedBox + 1]?.getBoundingClientRect();
    let containerRect = document.getElementsByClassName('question-form')[0]?.getBoundingClientRect();
    return elementRect?.top >= containerRect?.top && elementRect.bottom <= containerRect.bottom;
  }

  // Function to handle scroll event
  const handleScroll = (event: any) => {
    setTimeout(() => {
      const isVisible = isElementBoxVisible();
      if (isVisible) {
        updateToolBoxPosition(currQueIdx);
      } else {
        setYOffset(event.target.scrollTop > 170 ? event.target.scrollTop : 165);
      }
    }, 300);
  };

  // updates tool box position when new question box is added
  const updateToolBoxPosition = (questionIndex?: number, addQuestion = false): void => {
    setTimeout(() => {
      if (isElementBoxVisible(questionIndex)) {
        if (inputRefs.current.length > 0 && inputRefs.current[0]) {
          let inputBoxIndex = questionIndex !== undefined ? questionIndex : questions.length - 1;
          const accordionRect = inputRefs.current[inputBoxIndex]?.getBoundingClientRect();
          if (accordionRect) {
            const scrollTop = document.getElementsByClassName('question-form')[0].scrollTop;
            let targetTopRelativeToDiv = accordionRect.top - 180 + scrollTop;
            // when adding a new question the box will not
            // align properly so we need it
            if (addQuestion) {
              targetTopRelativeToDiv += 26;
            }
            setYOffset(targetTopRelativeToDiv > 0 ? targetTopRelativeToDiv : 0);
          }
        } else {
          setYOffset(0);
          setCurQueIdx(0);
        }
      }
    }, 300);
  }

  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }
    var itemgg = [...questions];
    const itemF = reorder(
      itemgg,
      result.source.index,
      result.destination.index
    );
    setQuestions(itemF as Question[]);
    toast.success('Questions swapped', {
      position: "bottom-right"
    });
    updateToolBoxPosition(currQueIdx);
  }

  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const closeAllExpandedQuestion = (): void => {
    let expandedQuestion = questions.map((question: Question) => {
      return question.openAndCloseQuestion(false);
    });
    setQuestions(expandedQuestion);
  }

  const handleExpand = (questionIndex: number): void => {
    let expandedQuestion = questions.map((question: Question, j: number) => {
      return question.openAndCloseQuestion(questionIndex == j);
    });
    setQuestions(expandedQuestion);
    setCurQueIdx(questionIndex);
  }

  const updateQuestion = (question: string, questionIndex: number): void => {
    let currentQuestions = [...questions];
    currentQuestions[questionIndex].updateQuestion(question);
    setQuestions(currentQuestions);
  }

  const addOption = (questionIndex: number): void => {
    let currentQuestions = [...questions];
    currentQuestions[questionIndex].addNewOption();
    setQuestions(currentQuestions);
  }

  const removeOption = (questionIndex: number, optionIndex: number): void => {
    let currentQuestions = [...questions];
    currentQuestions[questionIndex].removeOption(optionIndex);
    setQuestions(currentQuestions);
  }

  const addQuestionTemplate = (): void => {
    closeAllExpandedQuestion();
    let currentQuestions = [...questions];
    currentQuestions.splice(currQueIdx + 1, 0, new Question());
    setQuestions(currentQuestions);
    setCurQueIdx(currQueIdx => currQueIdx + 1);
    setTimeout(() => {
      updateToolBoxPosition(currQueIdx, true); // Call updateToolBoxPosition after a brief delay
    }, 0);
    toast.success('Question added', {
      position: "bottom-right"
    })
  }

  const updatedQuestionType = (questionIndex: number, type: any): void => {
    let currentQuestions = [...questions];
    currentQuestions[questionIndex].updateQuestionType(type);
    setQuestions(currentQuestions);
  }

  const deleteQuestion = (questionIndex: number): void => {
    closeAllExpandedQuestion();
    let currentQuestions = [...questions];
    currentQuestions.splice(questionIndex, 1);
    inputRefs.current.splice(questionIndex, 1);

    if (questionIndex >= 1) {
      currentQuestions[questionIndex - 1].openAndCloseQuestion(true);
      updateToolBoxPosition(questionIndex - 1);
      setCurQueIdx(currQueIdx => currQueIdx - 1);
    } else if (questionIndex == 0 && currentQuestions.length > 0) {
      currentQuestions[questionIndex].openAndCloseQuestion(true);
      updateToolBoxPosition(questionIndex);
      setCurQueIdx(currQueIdx => questionIndex == 0 ? questionIndex : currQueIdx - 1);
    } else {
      setCurQueIdx(0);
      updateToolBoxPosition(questionIndex);
    }
    setQuestions(() => [...currentQuestions]);
    toast.success('Question deleted', {
      position: "bottom-right"
    })
  }

  const handleOptionValue = (value: string, questionIndex: number, optionIndex: number): void => {
    let currentQuestions = [...questions];
    currentQuestions[questionIndex].updateOption(optionIndex, value);
    setQuestions(currentQuestions);
  }

  const copyQuestion = (questionIndex: number): void => {
    closeAllExpandedQuestion();
    setCurQueIdx(questionIndex => questionIndex + 1);
    let currentQuestions = [...questions];
    let copiedQuestion = currentQuestions[questionIndex].copyQuestion();
    currentQuestions.splice(questionIndex + 1, 0, copiedQuestion);
    setQuestions(currentQuestions);
    updateToolBoxPosition(questionIndex + 1);
    toast.success('Question copied', {
      position: "bottom-right"
    })
  }

  const requiredQuestion = (questionIndex: number): void => {
    let currentQuestions = [...questions];
    currentQuestions[questionIndex].updateRequiredType();
    setQuestions(currentQuestions);
  }

  const displayQuestions = () => {
    return questions.map((question: Question, i: any) => {
      return <Draggable key={question._id} draggableId={question._id} index={i} isDragDisabled={questionPaper.showQuestionPaper}>
        {(provided) => (
          <div ref={provided.innerRef}  {...provided.draggableProps} {...provided.dragHandleProps}>
            <div>
              <div className={questionPaper.showQuestionPaper ? " question-container add-margin" : "question-container"}>
                {
                  !questionPaper.showQuestionPaper && (
                    <div className="drag-indicator-box">
                      <DragIndicatorIcon className="icon" fontSize="small" />
                    </div>
                  )
                }
                <Accordion onChange={(event) => {
                  if (!questionPaper.showQuestionPaper) {
                    handleExpand(i);
                    updateToolBoxPosition(i);
                  }
                }} expanded={questions[i].open} className={questions[i].open ? "MuiAccordion-root add-border" : "MuiAccordion-root"}>
                  <AccordionSummary aria-controls="panel1-content" id="panel1-header">
                    {(!questions[i].open) && (
                      <DisplayQuestion questionIndex={i} question={question}
                        showQuestionPaper={questionPaper.showQuestionPaper} />
                    )}
                  </AccordionSummary>
                  <div className="question-box">
                    <AccordionDetails className="add-question">
                      <div>
                        <div className="add-question-top">
                          <textarea className="question"
                            ref={(e) => { inputRefs.current[i] = e }}
                            placeholder="Question" value={question.question} onChange={(e) => { updateQuestion(e.target.value, i) }} />

                          {/* selection box to select question type  */}
                          <SelectBox questionIndex={i} updatedQuestionType={updatedQuestionType} question={question} />
                        </div>

                        {/* adding options */}
                        <OptionBox question={question} questionIndex={i}
                          addOption={addOption} removeOption={removeOption} handleOptionValue={handleOptionValue} />

                        {/* question box footer with action buttons  */}
                        <QuestionBoxFooter isRequired={question.required} questionIndex={i} copyQuestion={copyQuestion}
                          deleteQuestion={deleteQuestion} requiredQuestion={requiredQuestion} />
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
      <div className={questionPaper.showQuestionPaper ? "question-paper-full-height question-form" : "question-form"} id="question-form" onScroll={handleScroll}>
        <div className="section">
          <div className="question-title-section">
            <div className="question-form-top">
              <input
                type="text"
                className="question-form-top-name MuiAccordion-root"
                placeholder="Untitled form"
                value={documentName}
                onChange={(e) => {
                  setDocName(e.target.value);
                  setQuestionPaper({
                    ...questionPaper,
                    documentName: e.target.value
                  });
                }}
                readOnly={questionPaper.showQuestionPaper}
              />
              <input
                type="text"
                className="question-form-top-desc"
                placeholder="Document description"
                value={documentDescription}
                onChange={(e) => {
                  setDocDesc(e.target.value);
                }}
                readOnly={questionPaper.showQuestionPaper}
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

          {
            !!questions.length && <div className="save-form">
              <Button
                variant="contained"
                color="primary"
                onClick={!questionPaper.showQuestionPaper ? updateDocument : () => { }} >
                {questionPaper.showQuestionPaper ? "Submit" : "Save"}
              </Button>
            </div>
          }
        </div>
        {
          !questionPaper.showQuestionPaper && (<div className="question-edit" style={{ top: `${yoffset}px` }} ref={divRef}>
            <Tooltip title="Add question" placement="right">
              <AddCircleOutlineIcon className="edit" onClick={() => addQuestionTemplate()} />
            </Tooltip>
            <OndemandVideoIcon className="edit" />
            <CropOriginalIcon className="edit" />
            <TextFieldsIcon className="edit" />
          </div>)
        }
      </div>
      {questionPaper.showQuestionPaper && (
        <Tooltip title="Edit">
          <CreateIcon className="edit-question-paper-icon" onClick={() => (setQuestionPaper({
            ...questionPaper,
            showQuestionPaper: !questionPaper.showQuestionPaper
          }))} />
        </Tooltip>)
      }
    </div >
  )
}
