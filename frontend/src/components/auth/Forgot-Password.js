import axios from "axios";
import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "./Auth";
import "./Signin.css";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: "",
  });

  const { email } = state;

  const onChange = (name) => (event) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const onsubmit = (e) => {
    e.preventDefault();
    axios
      .put("/forgot-password", { email })
      .then((res) => {
        setState({
          ...state,
          email: "",
        });
        toast.info(res.data.message);
      })
      .catch((err) => {
        setState({
          ...state,
          email: "",
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
            <h6 className="display-6 text-center">Forgot-Password Page</h6>
            <h6 className="text-center pt-2 pb-2">
              Please enter your registerd email to receive password reset link.
            </h6>

            <form className="needs-validation" noValidate>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Your Email "
                  onChange={onChange("email")}
                  value={email}
                  required
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={onsubmit}
                >
                  Get Reset Link
                </button>
              </div>

              <div className="mb-3 mt-3">
                <p>
                  <Link to="/signup">Need an account ? Register here</Link>
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

export default ForgotPassword;
