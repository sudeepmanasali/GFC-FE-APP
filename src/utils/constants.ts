import { Question as QueObject } from "./Question"

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
  IS_AUTH = 'IS_AUTH',
  APP_TOUR_COMPLETED = 'APP_TOUR_COMPLETED'
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
  HOME = '/',
  LOGIN = '/login',
  QUESTION_PAPER = '/forms/:documentId',
  USERVIEW = '/viewform/:documentId'
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
  DELETE_DOCUMENT = '/delete',
  UPDATE_DOCUMENT = '/update-document',
  USER_RESPONSE = '/user-response'
}

export enum PROFILE_ACTION_MENUS {
  LOGOUT = 'Logout'
}

export enum QUESTION_ACTION_TYPES {
  DOCUMENT_LOADED = 'DOCUMENT_LOADED',
  CLOSE_EXPANDED_QUESTIONS = 'CLOSE_EXPANDED_QUESTIONS',
  EXPAND_QUESTION = 'EXPAND_QUESTION',
  UPDATE_QUESTION = 'UPDATE_QUESTION',
  ADD_NEW_OPTION = 'ADD_NEW_OPTION',
  REMOVE_OPTION = 'REMOVE_OPTION',
  ADD_NEW_QUESTION = 'ADD_NEW_QUESTION',
  UPDATE_QUESTION_TYPE = 'UPDATE_QUESTION_TYPE',
  DELETE_QUESTION = 'DELETE_QUESTION',
  COPY_QUESTION = 'COPY_QUESTION',
  TOGGLE_REQUIRED = 'TOGGLE_REQUIRED',
  HANDLE_OPTION_VALUE = 'HANDLE_OPTION_VALUE',
  UPDATE_DOCUMENT_NAME = 'UPDATE_DOCUMENT_NAME',
  UPDATE_DOCUMENT_DESCRIPTION = 'UPDATE_DOCUMENT_DESCRIPTION',
  REORDER_QUESTIONS = 'REORDER_QUESTIONS',
  VIEW_DOCUMENT = 'VIEW_DOCUMENT'
}

export const SOCKET_CHANNEL_NAMES = {
  USER_RESPONSE: 'USER_RESPONSE'
}

export const REQUEST_SUCCESS_MESSAGES = {
  RESPONSE_LOADED_SUCCESSFULLY: 'Responses loaded successfully',
  LOGGED_IN_SUCCESSFULLY: 'Logged in successfully',
  USER_REGISTERED_SUCCESSFULLY: 'User registered successfully',
  DOCUMENT_DELETED_SUCCESSFULLY: 'Document deleted successfully',
  QUESTIONS_LOADED_SUCCESSFULLY: 'Questions loaded successfully',
  FORMS_LOADED_SUCCESSFULLY: 'Forms loaded successfully',
  DOCUMENT_CREATED_SUCCESSFULLY: 'Document created successfully',
  QUESTIONS_SAVED_SUCCESSFULLY: "Questions saved successfully",
  REQUEST_SAVED_SUCCESSFULLY: "Response saved successfully"
}

export const REQUEST_FAILURE_MESSAGES = {
  PLEASE_ENTER_DETAILS: "Please enter all valid details",
  LOGIN_FAILED: 'Login Failed, Please try again',
  REGISTRATION_FAILED: 'Registration Failed, Please try again',
  DOCUMENT_DELETION_FAILED: 'Document is not deleted, Please try again',
  DOCUMENT_CREATION_FAILED: 'Document creation failed, Please try again',
  DOCUMENT_LOADING_FAILED: 'Unable to load the documents',
  QUESTIONS_LOADING_FAILED: 'Unable to load the questions',
  SAVING_QUESTIONS_FAILED: 'Unable to save the questions',
  SAVING_USER_RESPONSE_FAILED: 'Unable to save the user response',
  PLEASE_ANSWER_ALL_REQUIRED_QUESTIONS: 'Please answer all required questions'
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

export interface DocumentInitialState {
  questions: QueObject[],
  documentName: string,
  documentDescription: string,
  currQueIndex: number,
  currentFocusedQuestionId: string,
  viewDocument: boolean,
  createdByUserID: string
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

export interface AuthContextType {
  isLoggedIn: boolean;
  user: any;
  handleLogin: React.Dispatch<React.SetStateAction<any>>;
  handleLogout: React.Dispatch<React.SetStateAction<any>>;
}

export interface QuestionPaper {
  showQuestionPaper: boolean,
  documentName: string
}

export interface QuestionPaperContextType {
  questionPaper: QuestionPaper;
  setQuestionPaper: React.Dispatch<React.SetStateAction<QuestionPaper>>;
}

export interface UndoRedoOperationItem {
  optionIndex?: number,
  questionIndex?: number,
  actionType?: QUESTION_ACTION_TYPES
}

export interface Answers {
  [key: string]: any
}

export interface ResponseData {
  id?: number,
  username?: string,
  submittedOn?: string
}

// constant variables
export const LOADING = 'loading';
export const INTERNAL_SERVER_ERROR = 'Internal Server Error';
export const REQUEST_IN_PROGRESS = 'Request in progress';
