// Files to define all the constants, enums and interfaces
export enum FOLDER_VIEW_TYPE {
  FILE = 'File',
  ROWS = 'Rows'
}

export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export enum SESSION_STORAGE_KEYS {
  TOKEN = 'TOKEN',
  USER_ID = 'USER_ID',
  EMAIL = 'EMAIL',
  USERNAME = 'USERNAME',
  IS_AUTH = 'IS_AUTH'
}

export enum ACTION_TYPES {
  ADD_QUESTION = 'ADD_QUESTION',
  CHANGE_TYPE = 'CHANGE_TYPE',
  SET_DOC_NAME = 'SET_DOC_NAME',
  SET_DOC_DESC = 'SET_DOC_DESC'
}

export enum QUESTION_TYPES {
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TEXT = 'text',
  DATE = 'date',
  TIME = 'datetime-local'
}

export enum ROUTE_PATHS {
  HOME = '/home',
  LOGIN = '/login',
  QUESTION_PAPER = '/question-paper/:documentId'
}

export enum UPDATE_QUESTION_STATE {
  ADD = 'ADD'
}

export enum REQUEST_URLS {
  LOGIN = '/login',
  REGISTER = '/register',
  CREATE_NEW_DOCUMENT = '/create-document',
  GET_ALL_DOCUMENTS = '/documents',
  GET_DOCUMENT = '/document',
  UPDATE_DOCUMENT = '/update-document'
}

// interfaces
export interface ActionPayload {
  type: ACTION_TYPES,
  [key: string]: any
}

export interface Option {
  option: string
}

export interface Question {
  question: string,
  questionType: string,
  options: Option[],
  open?: boolean,
  required?: boolean
}

export interface AppState {
  questions: Question[],
  doc_name: string,
  doc_desc: string
}

export interface UserRegister {
  username?: string,
  email?: string,
  phone?: string,
  password?: string
}

export interface UserLogin {
  email?: string,
  password?: string
}

export interface Option {
  option: string
}

export interface Theme {
  backgroundColor: string;
  textColor: string;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

export interface QuestionPaper {
  showQuestionPaper: boolean,
  documentName: string
}
export interface QuestionPaperContextType {
  questionPaper: QuestionPaper;
  setQuestionPaper: React.Dispatch<React.SetStateAction<QuestionPaper>>;
}
