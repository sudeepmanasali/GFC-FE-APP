import { Question } from "./Question";
import { UPDATE_QUESTION_STATE } from "./constants";

type actionType = { type: UPDATE_QUESTION_STATE, payload: any };

export const questionsStateReducer = (state: Question[], action: actionType) => {

    switch (action.type) {
        case UPDATE_QUESTION_STATE.ADD: {
            return { ...state }
        }
    }
    return state;
}
