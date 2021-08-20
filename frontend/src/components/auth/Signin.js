import React, { useState } from "react";
import "./Signin.css";
import axios from "axios";
import { authenticate, isAuthenticated } from "./Auth";
import { Redirect, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Signin = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const { email, password } = state;

  const onChange = (name) => (event) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    setState({
      ...state,
    });
    axios
      .post(`/signin`, {
        email,
        password,
      })
      .then((res) => {
        authenticate(res, () => {
          setState({
            ...state,
            email: "",
            password: "",
          });
          toast.success(`Hey ${res.data.user.firstName}, Welcome Back`);
        });
      })
      .catch((err) => {
        setState({
          ...state,
          email: "",
          password: "",
        });
        toast.error(err.response.data.error);
      });
  };

  return (
    <>
      {isAuthenticated() ? <Redirect to="/" /> : null}
      <div className="container ">
        <div className="row">
          <div className="col-lg-3"></div>

          <div className="col-lg-6 logincontainer">
            <h6 className="display-6 text-center">Login</h6>

            <form
              className="needs-validation"
              onSubmit={handelSubmit}
              noValidate
            >
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your Email "
                  onChange={onChange("email")}
                  value={email}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Your Password "
                  onChange={onChange("password")}
                  value={password}
                  required
                />
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>

              <div className="mb-3 mt-3">
                <p>
                  <Link to="/signup">Need an account ? Register here</Link>
                </p>
                <p>
                  <Link to="/forgot-password">Forgot Password</Link>
                </p>
              </div>
            </form>
          </div>
          <div className="col-lg-3"></div>
        </div>
      </div>
    </>
  );
};

export default Signin;
