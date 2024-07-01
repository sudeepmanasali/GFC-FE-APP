import React, { useState } from "react";
// import useAuthListener, { validateTokenAge } from "./AuthValidate";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HTTP_METHODS, REQUEST_URLS, ROUTE_PATHS, SESSION_STORAGE_KEYS, UserLogin, UserRegister } from "../utils/constants";
import { validateEmail } from "../utils/util";
import "./Login.scss";
import useAxios from "../utils/axios";
import toast from "react-hot-toast";

function Login() {
  let [isLogin, setIsLogin] = useState(false);
  let [register, setRegister] = useState<UserRegister>({});
  let [login, setLogin] = useState<UserLogin>({});
  const navigate = useNavigate();
  const HttpRequestController = useAxios();

  const handleLogin = async () => {
    if (login.email && login.password && validateEmail(login.email)) {
      const res = await HttpRequestController(REQUEST_URLS.LOGIN, HTTP_METHODS.POST, login);
      if (res) {
        localStorage.setItem(SESSION_STORAGE_KEYS.TOKEN, res.token);
        localStorage.setItem(SESSION_STORAGE_KEYS.EMAIL, res.data.email);
        localStorage.setItem(SESSION_STORAGE_KEYS.USER_ID, res.data.userId);
        localStorage.setItem(SESSION_STORAGE_KEYS.USERNAME, res.data.username);
        localStorage.setItem(SESSION_STORAGE_KEYS.IS_AUTH, 'true');
        toast.success(res.message);
        navigate(ROUTE_PATHS.HOME);
        setLogin({});
      }
    } else {
      toast.error("Please enter all required details...!");
    }
  };

  const handleRegister = async () => {
    if (register.username && register.username.trim().length != 0 && register.password && register.email && register.phone) {
      await HttpRequestController(REQUEST_URLS.REGISTER, HTTP_METHODS.POST, register);
      setIsLogin(true);
      setRegister({});
      toast.success("User registered successfully");
    } else {
      toast.error("Please enter all required details...!");
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
            <input
              type="text"
              name="txt"
              onChange={(e) =>
                setRegister({ ...register, username: e.target.value })
              }
              placeholder="User name"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => {
                setRegister({ ...register, email: e.target.value });
              }}
            />
            <input
              type="number"
              name="phone"
              placeholder="phone number"
              onChange={(e) => {
                setRegister({ ...register, phone: e.target.value });
              }}
            />
            <input
              type="password"
              onChange={(e) => {
                setRegister({ ...register, password: e.target.value });
              }}
              name="password"
              placeholder="Password"
            />
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
            <input type="password"
              name="password"
              onChange={(e) => {
                setLogin({ ...login, password: e.target.value });
              }}
              placeholder="Password"
            />
            <button onClick={handleLogin}>Sign In</button>
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
