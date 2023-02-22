import { combineReducers } from "redux";
import { userReducer } from "./userReducers";
import { themeReducer } from "./themeReducer";

const rootReducer = combineReducers({
  user: userReducer,
  dark: themeReducer,
});

export default rootReducer;
