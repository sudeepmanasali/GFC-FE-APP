import { jwtDecode } from "jwt-decode";
import { SESSION_STORAGE_KEYS } from "./constants";

export function validateTokenAge() {
  let user: any, jwt: string;
  jwt = localStorage.getItem(SESSION_STORAGE_KEYS.TOKEN) || "";
  user = jwtDecode(jwt);

  const expDate = new Date(user.exp * 1000);
  const curr = new Date();
  if (expDate.getTime() - curr.getTime() < 0) {
    localStorage.clear();
    return false;
  }
  return true;
}

export default function getUserInfo() {
  let user: any, jwt;
  try {
    jwt = localStorage.getItem(SESSION_STORAGE_KEYS.TOKEN) || "";
    user = jwtDecode(jwt);
  } catch (error) {
    user = null;
  }
  return { user, jwt };
}
