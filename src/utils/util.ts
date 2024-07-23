import { QUESTION_TYPES } from "./constants";

// all the functions, methods
export const shortString = (text: string, maxLen = 9) => {
  return text?.length <= maxLen ? text : text?.substring(0, maxLen)?.concat("...");
};

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}`,
  };
}

// validates the email id
export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// used to create random string based on the requested length
export function createRandomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// returns current date time
export const getCurrentDateTime = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const seconds = String(today.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// returns if question type is multiple section or multiple choice
export const isSelectionType = (questionType: QUESTION_TYPES): boolean => {
  let selectionTypes = [QUESTION_TYPES.RADIO, QUESTION_TYPES.CHECKBOX];
  return selectionTypes.includes(questionType);
}

// delay the execution of a function untill a certain amount of time passed
export const debounce = function (func: Function, delay: number) {
  let timer: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  }
}
