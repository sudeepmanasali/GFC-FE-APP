import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HTTP_METHODS, REQUEST_FAILURE_MESSAGES, REQUEST_IN_PROGRESS, REQUEST_SUCCESS_MESSAGES, REQUEST_URLS, ROUTE_PATHS, SESSION_STORAGE_KEYS, UserLogin, UserRegister } from "../utils/constants";
import { validateEmail } from "../utils/util";
import "./Login.scss";
import useAxios from "../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "./contexts/auth-context";
import { Button } from "@mui/material";

function Login() {
  let [isLogin, setIsLogin] = useState(false);
  let [register, setRegister] = useState<UserRegister>({});
  let [login, setLogin] = useState<UserLogin>({});
  const navigate = useNavigate();
  const { HttpRequestController, isRequestPending, handlePromiseRequest } = useAxios();
  const { handleLogin } = useAuth();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: ROUTE_PATHS.HOME } };

  const setLocalStorageData = (response: any) => {
    localStorage.setItem(SESSION_STORAGE_KEYS.TOKEN, response.token);
    localStorage.setItem(SESSION_STORAGE_KEYS.EMAIL, response.data.email);
    localStorage.setItem(SESSION_STORAGE_KEYS.USER_ID, response.data.userId);
    localStorage.setItem(SESSION_STORAGE_KEYS.USERNAME, response.data.username);
    localStorage.setItem(SESSION_STORAGE_KEYS.IS_AUTH, 'true');
    navigate(from, { replace: true });
    handleLogin(true);
  }

  const sendLoginRequest = async () => {
    const res = await HttpRequestController(REQUEST_URLS.LOGIN, HTTP_METHODS.POST, login);
    if (res) {
      setLocalStorageData(res);
      setLogin({});
    }
  }

  const sendRegisterRequest = async () => {
    let payload = { ...register }
    const res = await HttpRequestController(REQUEST_URLS.REGISTER, HTTP_METHODS.POST, payload);
    if (res) {
      setLocalStorageData(res);
      setRegister({});
    }
  }

  const handleLoginFunction = async () => {
    if (login.email && login.password && validateEmail(login.email)) {
      handlePromiseRequest(sendLoginRequest, REQUEST_IN_PROGRESS, REQUEST_SUCCESS_MESSAGES.LOGGED_IN_SUCCESSFULLY, REQUEST_FAILURE_MESSAGES.LOGIN_FAILED);
    } else {
      toast.error(REQUEST_FAILURE_MESSAGES.PLEASE_ENTER_DETAILS);
    }
  };

  const handleRegister = async () => {
    if (register.username && register.username.trim().length != 0 && register.password && register.email
      && validateEmail(register.email) && register.phone && register.phone.length == 10) {
      handlePromiseRequest(sendRegisterRequest, REQUEST_IN_PROGRESS, REQUEST_SUCCESS_MESSAGES.USER_REGISTERED_SUCCESSFULLY,
        REQUEST_FAILURE_MESSAGES.REGISTRATION_FAILED);
    } else {
      toast.error(REQUEST_FAILURE_MESSAGES.PLEASE_ENTER_DETAILS);
    }
  };

  return (
    <div className="login-container">
      <div className="main">
        {!isLogin ? (
          <div className="signup">
            <label htmlFor="chk" aria-hidden="true">
              Sign up
            </label>
            <div className="input-box">
              <input
                type="text"
                name="txt"
                onChange={(e) =>
                  setRegister({ ...register, username: e.target.value })
                }
                placeholder="User name"
              />
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={(e) => {
                  setRegister({ ...register, email: e.target.value });
                }}
              />
              {register.email && !validateEmail(register?.email) && (
                <div className="error-text">
                  Please enter valid email
                </div>
              )}
            </div>
            <div className="input-box">
              <input
                type="number"
                name="phone"
                placeholder="Phone number"
                onChange={(e) => {
                  setRegister({ ...register, phone: e.target.value });
                }}
              />
              {register.phone && register.phone.length != 10 && (
                <div className="error-text">
                  Please enter valid phone number
                </div>
              )}
            </div>
            <div className="input-box">
              <input
                type="password"
                onChange={(e) => {
                  setRegister({ ...register, password: e.target.value });
                }}
                name="password"
                placeholder="Password"
              />
            </div>
            <div className="buttons">
              <Button color="primary" variant="contained" onClick={handleRegister} disabled={isRequestPending}>Sign Up</Button>
              <Button color="primary" onClick={(e) => { setIsLogin(!isLogin); }}>Sign In</Button>
            </div>
          </div>
        ) : (
          <div className="signup">
            <label htmlFor="chk" aria-hidden="true">
              Login
            </label>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={(e) => {
                  setLogin({ ...login, email: e.target.value });
                }}
              />
              {login?.email && !validateEmail(login?.email) && (
                <div className="error-text">
                  Please enter valid email
                </div>
              )}
            </div>
            <div className="input-box">
              <input type="password"
                name="password"
                onChange={(e) => {
                  setLogin({ ...login, password: e.target.value });
                }}
                placeholder="Password"
              />
            </div>
            <div className="buttons">
              <Button color="primary" variant="contained" onClick={handleLoginFunction} disabled={isRequestPending}>Sign In</Button>
              <Button color="primary" onClick={(e) => { setIsLogin(!isLogin); }}>Sign Up</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
