import { createContext, useContext, useReducer, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxios from "utils/axios";
import {
  REQUEST_URLS, HTTP_METHODS, QUESTION_ACTION_TYPES, DocumentInitialState,
  LOADING, INTERNAL_SERVER_ERROR, REQUEST_SUCCESS_MESSAGES, REQUEST_FAILURE_MESSAGES,
  SOCKET_CHANNEL_NAMES, ResponseData
} from "utils/constants";
import { Question } from "utils/Question";
import socket from "utils/SocketManager";
import { useAuth } from "./auth-context";

const DocumentContext = createContext<null | any>(null);

// initial state of the document
const initialState: DocumentInitialState = {
  questions: [],
  documentName: "",
  documentDescription: '',
  currentFocusedQuestionId: 'sdd',
  currQueIndex: 0,
  viewDocument: false,
  createdByUserID: ''
};

// updated the state based on the user actions
function reducer(state: any, action: any) {
  let queIdx = action.payload?.questionIndex;

  switch (action.type) {
    // 
    case QUESTION_ACTION_TYPES.DOCUMENT_LOADED: {
      return {
        ...state,
        documentName: action.payload?.documentName,
        documentDescription: action.payload?.documentDescription,
        questions: action.payload?.questions.map((question: Question) => {
          question.open = false;
          return new Question(question);
        }),
        createdByUserID: action.payload.createdByUserID,
        currentFocusedQuestionId: action.payload.questions[0]?._id || ''
      };
    }

    // closes the focused question box
    case QUESTION_ACTION_TYPES.CLOSE_EXPANDED_QUESTIONS:
      return {
        ...state,
        currentFocusedQuestionId: state.questions.length > 0 ? state.questions[0]._id : '',
        questions: state.questions.map((question: Question) => {
          return question.openAndCloseQuestion(false);
        })
      };

    // opens the focused question box
    case QUESTION_ACTION_TYPES.EXPAND_QUESTION:
      return {
        ...state,
        currQueIndex: queIdx,
        questions: state.questions.map((question: Question, j: number) => {
          return question.openAndCloseQuestion(queIdx == j);
        }),
        currentFocusedQuestionId: state.questions[queIdx]._id
      };

    // updates the question
    case QUESTION_ACTION_TYPES.UPDATE_QUESTION:
      {
        let questionText = action.payload.questionText;
        let currentQuestions = [...state.questions];
        currentQuestions[queIdx].updateQuestion(questionText);
        return {
          ...state,
          currQueIndex: queIdx,
          questions: currentQuestions,
          currentFocusedQuestionId: state.questions[queIdx]._id
        };
      }

    // adds new option to the question
    case QUESTION_ACTION_TYPES.ADD_NEW_OPTION:
      {
        let currentQuestions = [...state.questions];
        currentQuestions[queIdx].addNewOption();
        return {
          ...state,
          currQueIndex: queIdx,
          questions: currentQuestions,
          currentFocusedQuestionId: state.questions[queIdx]._id
        };
      }

    // remove the option from a question  
    case QUESTION_ACTION_TYPES.REMOVE_OPTION:
      {
        let optIndex = action.payload.optionIndex;
        let currentQuestions = [...state.questions];
        currentQuestions[queIdx].removeOption(optIndex);
        return {
          ...state,
          currQueIndex: queIdx,
          questions: currentQuestions,
          currentFocusedQuestionId: state.questions[queIdx]._id
        };
      }

    // adds new question to the document
    case QUESTION_ACTION_TYPES.ADD_NEW_QUESTION:
      {
        let currentQuestions = [...state.questions];
        let newQue = new Question();
        currentQuestions.splice(state.currQueIndex + 1, 0, newQue);
        return {
          ...state,
          currQueIndex: state.currQueIndex + 1,
          questions: currentQuestions,
          currentFocusedQuestionId: newQue._id
        };
      }

    // updating the question type like radio, checkbox, text, date and time
    case QUESTION_ACTION_TYPES.UPDATE_QUESTION_TYPE:
      {
        let currentQuestions = [...state.questions];
        currentQuestions[queIdx].updateQuestionType(action.payload.queType);
        return {
          ...state,
          currQueIndex: queIdx,
          questions: currentQuestions,
          currentFocusedQuestionId: state.questions[queIdx]._id
        };
      }

    // deletes the question
    case QUESTION_ACTION_TYPES.DELETE_QUESTION:
      {
        let currentQuestions = [...state.questions];
        currentQuestions.splice(queIdx, 1);
        let index = queIdx - 1 > 0 ? queIdx - 1 : 0;

        if (currentQuestions.length > 0) {
          currentQuestions[index].openAndCloseQuestion(true);
        }
        return {
          ...state,
          currQueIndex: index,
          questions: currentQuestions,
          currentFocusedQuestionId: state.questions[index]._id
        };
      }

    // copies the question
    case QUESTION_ACTION_TYPES.COPY_QUESTION:
      {
        let currentQuestions = [...state.questions];
        let copiedQuestion = currentQuestions[queIdx].copyQuestion();
        currentQuestions.splice(queIdx + 1, 0, copiedQuestion);
        return {
          ...state,
          currQueIndex: queIdx + 1,
          questions: currentQuestions,
          currentFocusedQuestionId: copiedQuestion._id
        };
      }

    // sets question is required or not
    case QUESTION_ACTION_TYPES.TOGGLE_REQUIRED:
      {
        let currentQuestions = [...state.questions];
        currentQuestions[queIdx].updateRequiredType();
        return {
          ...state,
          currQueIndex: queIdx,
          questions: currentQuestions,
          currentFocusedQuestionId: state.questions[queIdx]._id
        };
      }

    // updated the option value for checkbox and radio type options
    case QUESTION_ACTION_TYPES.HANDLE_OPTION_VALUE:
      {
        let optionValue = action.payload.optionValue;
        let optIndex = action.payload.optionIndex
        let currentQuestions = [...state.questions];
        currentQuestions[queIdx].updateOption(optIndex, optionValue);
        return {
          ...state,
          currQueIndex: queIdx,
          questions: currentQuestions,
          currentFocusedQuestionId: state.questions[queIdx]._id
        };
      }

    // on drag and drop action it will update the sequence of questions
    case QUESTION_ACTION_TYPES.REORDER_QUESTIONS:
      {
        return {
          ...state,
          questions: action.payload.questions
        };
      }

    // updates the document name
    case QUESTION_ACTION_TYPES.UPDATE_DOCUMENT_NAME:
      return {
        ...state,
        documentName: action.payload.documentName
      };

    // updates the document description
    case QUESTION_ACTION_TYPES.UPDATE_DOCUMENT_DESCRIPTION:
      return {
        ...state,
        documentDescription: action.payload.documentDescription
      };

    // updates the viewDocument property
    // when viewDocument is true, the question boxes will not be editable and toolmbox will not be visible
    case QUESTION_ACTION_TYPES.VIEW_DOCUMENT:
      return {
        ...state,
        viewDocument: !state.viewDocument
      };
  }
}

// provides the document data and document responses to the child components
const DocumentContextProvider: React.FC<any> = ({ children }) => {
  let params = useParams();
  let [formResponses, setFormResponses] = useState<ResponseData | any>([]);
  let [rows, setRows] = useState<ResponseData | any>([]);
  let { HttpRequestController, handlePromiseRequest, isRequestPending } = useAxios();
  let { user } = useAuth();
  const [
    { questions, documentName, documentDescription, currQueIndex, currentFocusedQuestionId, viewDocument, createdByUserID }, dispatch
  ] = useReducer(reducer, initialState);

  // loades the document questions and options
  const loadDocument = async () => {
    let { document } = await HttpRequestController(REQUEST_URLS.GET_DOCUMENT + `/${params.documentId}`, HTTP_METHODS.GET);
    if (document) {
      dispatch({ type: QUESTION_ACTION_TYPES.DOCUMENT_LOADED, payload: document });
    }
  }

  useEffect(() => {
    handlePromiseRequest(loadDocument, LOADING, REQUEST_SUCCESS_MESSAGES.QUESTIONS_LOADED_SUCCESSFULLY, REQUEST_FAILURE_MESSAGES.QUESTIONS_LOADING_FAILED);
  }, []);

  useEffect(() => {
    // when the user opens the document which is not created by him, then it
    // will not retreive the responses for that document
    if (createdByUserID === user.userId) {
      handlePromiseRequest(loadResponse, LOADING, REQUEST_SUCCESS_MESSAGES.RESPONSE_LOADED_SUCCESSFULLY, INTERNAL_SERVER_ERROR);
    }
  }, [createdByUserID])

  let idCounter = 0;
  // to create a new row, with new id
  const createRow = (username: string, submittedOn: string) => {
    return { id: ++idCounter, username, submittedOn };
  };

  const loadResponse = async () => {
    let responseData = await HttpRequestController(REQUEST_URLS.USER_RESPONSE + `/${params.documentId}`, HTTP_METHODS.GET);
    let rowsData = responseData.formResponses.map((formResponse: any) => {
      return createRow(formResponse.userId.username, formResponse.submittedOn);
    });
    setFormResponses(responseData.formResponses);
    setRows(rowsData);

    // when ever other users submit the response for this document
    // lively it will update the table with new row 
    socket.on(SOCKET_CHANNEL_NAMES.USER_RESPONSE, (newData: any) => {
      if (newData.documentId == params.documentId) {
        let newFormResponse = createRow(newData.userId.username, newData.submittedOn);
        setRows([...rowsData, newFormResponse]);
        setFormResponses([...responseData.formResponses, newData])
      }
    });
  }

  return (
    <DocumentContext.Provider
      value={{
        questions, documentDescription, documentName, currQueIndex, currentFocusedQuestionId, viewDocument, createdByUserID, user,
        dispatch, isRequestPending, rows, formResponses
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined)
    throw new Error("DocumentContext was used outside of the DocumentContextProvider");
  return context;
}

export { DocumentContextProvider, useDocument };
