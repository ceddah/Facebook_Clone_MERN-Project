import Cookies from "js-cookie";

export const themeReducer = (
  state = Cookies.get("darkTheme") ? JSON.parse(Cookies.get("darkTheme")) : false,
  action
) => {
  switch (action.type) {
    case "DARK": {
      Cookies.set("darkTheme", true);
      return true;
    }
    case "LIGHT": {
      Cookies.set("darkTheme", false);
      return false;
    }
    default: {
      return state;
    }
  }
};
