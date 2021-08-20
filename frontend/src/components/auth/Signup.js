import React, { useState } from "react";
import { isAuthenticated } from "./Auth";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Signup = ({ history }) => {
  const [state, setstate] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { firstName, lastName, email, password } = state;

  const onChange = (name) => (event) => {
    setstate({
      ...state,
      [name]: event.target.value,
    });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    setstate({
      ...state,
    });
    axios
      .post("/signup", {
        firstName,
        lastName,
        email,
        password,
      })
      .then((res) => {
        setstate({
          ...state,
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
        toast.info(res.data.message);
        history.push("/signin");
      })
      .catch((err) => {
        setstate({
          ...state,
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
        toast.error(err.response.data.error);
        // console.log(err.response.data.error);
      });
  };

  return (
    <>
      {isAuthenticated() ? <Redirect to="/" /> : null}

      <div className="container ">
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-6 logincontainer">
            <h6 className="display-6 text-center">Register</h6>
            <form className="mt-5" onSubmit={handelSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  onChange={onChange("firstName")}
                  value={firstName}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  onChange={onChange("lastName")}
                  value={lastName}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={onChange("email")}
                  value={email}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  onChange={onChange("password")}
                  value={password}
                  required
                />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>
              <div className="mb-3 mt-3">
                <p>
                  <Link to="/signin">Already have an account ? Login here</Link>
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

export default Signup;
