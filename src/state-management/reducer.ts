import { createContext } from "react";
import { ACTION_TYPES, ActionPayload, AppState } from "../utils/constants";

export const initialState: AppState = {
    questions: [{ question: "Question", questionType: "radio", options: [{ option: "Option 1" }], open: true, required: false }],
    doc_name: "Untitled form",
    doc_desc: "Add the description"
}

const reducer = (state: AppState, action: ActionPayload) => {
    switch (action.type) {
        case ACTION_TYPES.ADD_QUESTION:
            return {
                ...state, questions: action.questions,
            };
        case ACTION_TYPES.CHANGE_TYPE:
            return {
                ...state, questionType: action.questionType,
            };
        case ACTION_TYPES.SET_DOC_NAME:
            return {
                ...state, doc_name: action.doc_name,
            };

        case ACTION_TYPES.SET_DOC_DESC:
            return {
                ...state, doc_desc: action.doc_desc,
            };
        default:
            return state;
    }
}

export default reducer;
