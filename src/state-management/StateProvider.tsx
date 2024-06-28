import React, { useContext, useReducer, createContext } from "react";
import { ACTION_TYPES, ActionPayload, AppState } from "../utils/constants";
import { initialState } from "./reducer";

export const StateContext = createContext(initialState);

// export const StateProvider = ({ reducer, initialState, children }) => {
//     return <StateContext.Provider value={useReducer(reducer, initialState)}>{children}</StateContext.Provider>
// }

export const useStateValue = () => useContext(StateContext);