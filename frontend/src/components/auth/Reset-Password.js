import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated } from "./Auth";

const ResetPassword = ({ match, history }) => {
  const [values, setValues] = useState({
    newPassword: "",
    token: "",
  });
  const { newPassword, token } = values;

  useEffect(() => {
    let token = match.params.token;
    if (token) {
      setValues({ ...values, token });
    }
  }, [match.params.token, values]);

  const onChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const onsubmit = (e) => {
    e.preventDefault();

    if (newPassword) {
      axios
        .put("/reset-password", {
          newPass: newPassword,
          resetLink: token,
        })
        .then((data) => {
          setValues({
            ...values,
            newPassword: "",
          });
          toast.success(data.data.message, history.push("/signin"));
        })
        .catch((data) => {
          setValues({
            ...values,
            newPassword: "",
          });
          toast.error(data.response.data.error);
        });
    } else {
      return false;
    }
  };

  return (
    <>
      {isAuthenticated() ? <Redirect to="/" /> : null}
      <div className="container ">
        <div className="row">
          <div className="col-lg-3"></div>

          <div className="col-lg-6 logincontainer">
            <h6 className="display-6 text-center">Reset Your Password</h6>
            <form className="needs-validation" noValidate>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Your New Password"
                  onChange={onChange("newPassword")}
                  value={newPassword}
                  required
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={onsubmit}
                >
                  Reset Password
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

export default ResetPassword;
