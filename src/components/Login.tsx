import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HTTP_METHODS, REQUEST_URLS, ROUTE_PATHS, SESSION_STORAGE_KEYS, UserLogin, UserRegister } from "../utils/constants";
import { validateEmail } from "../utils/util";
import "./Login.scss";
import useAxios from "../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "./contexts/auth-context";

function Login() {
  let [isLogin, setIsLogin] = useState(false);
  let [register, setRegister] = useState<UserRegister>({});
  let [login, setLogin] = useState<UserLogin>({});
  const navigate = useNavigate();
  const HttpRequestController = useAxios();
  const { handleLogin } = useAuth();

  const sendLoginRequest = async () => {
    const res = await HttpRequestController(REQUEST_URLS.LOGIN, HTTP_METHODS.POST, login);
    if (res) {
      localStorage.setItem(SESSION_STORAGE_KEYS.TOKEN, res.token);
      localStorage.setItem(SESSION_STORAGE_KEYS.EMAIL, res.data.email);
      localStorage.setItem(SESSION_STORAGE_KEYS.USER_ID, res.data.userId);
      localStorage.setItem(SESSION_STORAGE_KEYS.USERNAME, res.data.username);
      localStorage.setItem(SESSION_STORAGE_KEYS.IS_AUTH, 'true');
      navigate(ROUTE_PATHS.HOME, { replace: true });
      setLogin({});
      handleLogin(true);
    }
  }

  const sendRegisterRequest = async () => {
    const res = await HttpRequestController(REQUEST_URLS.REGISTER, HTTP_METHODS.POST, register);
    if (res) {
      setIsLogin(true);
      setRegister({});
    }
  }

  const handleLoginFunction = async () => {
    if (login.email && login.password && validateEmail(login.email)) {
      toast.promise(
        sendLoginRequest(),
        {
          loading: 'Request in progress',
          success: 'Logged in successfully',
          error: 'Login Failed, Please try again'
        }
      );
    } else {
      toast.error("Please enter all valid details");
    }
  };

  const handleRegister = async () => {
    if (register.username && register.username.trim().length != 0 && register.password && register.email
      && validateEmail(register.email) && register.phone && register.phone.length == 10) {
      toast.promise(
        sendRegisterRequest(),
        {
          loading: 'Request in progress',
          success: 'Registered successfully',
          error: 'Registration Failed, Please try again'
        }
      );
    } else {
      toast.error("Please enter all valid details");
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
                placeholder="phone number"
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
            <button onClick={handleRegister}>Sign Up</button>
            <div onClick={(e) => { setIsLogin(!isLogin); }} className="text-button">
              Sign In
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
            <button onClick={handleLoginFunction}>Sign In</button>
            <div onClick={(e) => {
              setIsLogin(!isLogin);
            }}
              className="text-button">
              Sign Up
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
