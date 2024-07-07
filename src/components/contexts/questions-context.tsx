import { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import useAxios from "utils/axios";
import { REQUEST_URLS, HTTP_METHODS, QUESTION_ACTION_TYPES, DocumentInitialState } from "utils/constants";
import { Question } from "utils/Question";

const DocumentContext = createContext<null | any>(null);

const initialState: DocumentInitialState = {
  questions: [],
  documentName: "",
  documentDescription: '',
  currentFocusedQuestionId: 'sdd',
  currQueIndex: 0,
  viewDocument: false,
  createdByUserID: ''
};

function reducer(state: any, action: any) {
  let queIdx = action.payload?.questionIndex;

  switch (action.type) {
    case QUESTION_ACTION_TYPES.DOCUMENT_LOADED: {
      return {
        ...state,
        documentName: action.payload.documentName,
        documentDescription: action.payload.documentDescription,
        questions: action.payload.questions.map((question: Question) => {
          question.open = false;
          return new Question(question);
        }),
        createdByUserID: action.payload.createdByUserID,
        currentFocusedQuestionId: action.payload.questions[0]?._id || ''
      };
    }

    case QUESTION_ACTION_TYPES.CLOSE_EXPANDED_QUESTIONS:
      return {
        ...state,
        currentFocusedQuestionId: state.questions.length > 0 ? state.questions[0]._id : '',
        questions: state.questions.map((question: Question) => {
          return question.openAndCloseQuestion(false);
        })
      };

    case QUESTION_ACTION_TYPES.EXPAND_QUESTION:
      return {
        ...state,
        currQueIndex: queIdx,
        questions: state.questions.map((question: Question, j: number) => {
          return question.openAndCloseQuestion(queIdx == j);
        }),
        currentFocusedQuestionId: state.questions[queIdx]._id
      };

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

    case QUESTION_ACTION_TYPES.DELETE_QUESTION:
      {
        let currentQuestions = [...state.questions];
        currentQuestions.splice(queIdx, 1);
        let index = queIdx - 1 > 0 ? queIdx - 1 : 0;
        currentQuestions[index].openAndCloseQuestion(true);
        return {
          ...state,
          currQueIndex: index,
          questions: currentQuestions,
          currentFocusedQuestionId: state.questions[index]._id
        };
      }

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

    case QUESTION_ACTION_TYPES.REORDER_QUESTIONS:
      {
        return {
          ...state,
          questions: action.payload.questions
        };
      }

    case QUESTION_ACTION_TYPES.UPDATE_DOCUMENT_NAME:
      return {
        ...state,
        documentName: action.payload.documentName
      };

    case QUESTION_ACTION_TYPES.UPDATE_DOCUMENT_DESCRIPTION:
      return {
        ...state,
        documentDescription: action.payload.documentDescription
      };

    case QUESTION_ACTION_TYPES.VIEW_DOCUMENT:
      return {
        ...state,
        viewDocument: !state.viewDocument
      };
    default:
      throw new Error("Action unkonwn");
  }
}

const DocumentContextProvider: React.FC<any> = ({ children }) => {
  let params = useParams();
  let { HttpRequestController } = useAxios();
  const [
    { questions, documentName, documentDescription, currQueIndex, currentFocusedQuestionId, viewDocument, createdByUserID }, dispatch
  ] = useReducer(reducer, initialState);

  const loadDocument = async () => {
    let { document } = await HttpRequestController(REQUEST_URLS.GET_DOCUMENT + `/${params.documentId}`, HTTP_METHODS.GET);
    dispatch({ type: QUESTION_ACTION_TYPES.DOCUMENT_LOADED, payload: document })
  }

  useEffect(() => {
    toast.promise(
      loadDocument(),
      {
        loading: 'loading...',
        success: 'Questions loaded successfully',
        error: 'Internal Server Error'
      }
    );
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        questions, documentDescription, documentName, currQueIndex, currentFocusedQuestionId, viewDocument, createdByUserID,
        dispatch
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
