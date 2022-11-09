import React, { useState, useEffect } from "react";
import "./login3.css";
import "./login.css";
import VectPat from "./vector-log-pat.png";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  login,
  register,
  clearErrors,
  loginErrors,
} from "../../../redux/userSlice";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";

const LoginUser = () => {
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useState({});

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };
  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(register(userInput));
  };
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(userInput));
  };
  //
  const history = useHistory();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(clearErrors());
    if (user.isAuth) {
      history.push("/");
    } else {
      history.push("/login");
    }
  }, [user.isAuth, history, dispatch]);

  return (
    <div className="patient-log-page">
      <div className="grid">
        <p className="stroke-shadow">Join us now !</p>
      </div>
      <div className="pat-log-container">
        <div className="vector-pat-log">
          <img id="vector-pat-log-img" src={VectPat} alt="" />

          {user && user.registerErrors && (
            <>
              <h1>sqdqsd</h1>

              {console.log(user.registerErrors)}
              <Alert severity="error">{user.registerErrors}</Alert>
            </>
          )}
          {user && user.loginErrors && (
            <>
              <Alert severity="error">{user.loginErrors.msg}</Alert>
            </>
          )}
        </div>
        <div className="pat-log-form">
          <div className="login-wrap">
            <div className="login-html">
              <input
                id="tab-1"
                type="radio"
                name="tab"
                className="sign-in"
                defaultChecked
              />
              <label htmlFor="tab-1" className="tab">
                Sign In
              </label>
              <input id="tab-2" type="radio" name="tab" className="sign-up" />
              <label htmlFor="tab-2" className="tab">
                Sign Up
              </label>
              <div className="login-form">
                <div className="sign-in-htm">
                  <div className="group">
                    <label htmlFor="user" className="label">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email"
                      name="email"
                      onChange={handleChange}
                      id="user-1"
                      className="input"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="pass-1" className="label">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="password"
                      name="password"
                      onChange={handleChange}
                      id="pass-2"
                      className="input"
                    />
                  </div>
                  <div className="group">
                    <input
                      type="checkbox"
                      className="check"
                      id="vehicle1 check"
                      name="vehicle1"
                      value="Bike"
                      defaultChecked
                    />
                    <label htmlFor="check vehicle1"> Keep me Signed in</label>
                    <br />
                  </div>
                  <div className="group">
                    <button
                      type="submit"
                      onClick={handleLogin}
                      className="button"
                    >
                      {" "}
                      Sign In{" "}
                    </button>
                  </div>
                  <div className="hr"></div>
                  <div className="foot-lnk">
                    <a href="#forgot">Forgot Password?</a>
                  </div>
                </div>
                <div className="sign-up-htm">
                  <div className="group">
                    <label htmlFor="pass-3" className="label">
                      First name
                    </label>
                    <input
                      type="text"
                      placeholder="fullname"
                      name="fullname"
                      onChange={handleChange}
                      id="pass-4"
                      className="input"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="pass" className="label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="email"
                      name="email"
                      onChange={handleChange}
                      id="pass-6"
                      className="input"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="pass" className="label">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="password"
                      name="password"
                      onChange={handleChange}
                      id="pass-7"
                      className="input"
                    />
                  </div>
                  <select name="role" onChange={handleChange}>
                    <option value="" name="role">
                      Choose...
                    </option>
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                  </select>

                  <div className="group">
                    <button
                      className="button"
                      type="submit"
                      onClick={handleRegister}
                    >
                      Sign Up
                    </button>
                  </div>
                  <div className="hr"></div>
                  <div className="foot-lnk">
                    <label htmlFor="tab-1" style={{ cursor: "pointer" }}>
                      Already Member?
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default LoginUser;
