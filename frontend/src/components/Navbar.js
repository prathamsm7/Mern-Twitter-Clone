import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./Navbar.css";
import { isAuthenticated, signout } from "./auth/Auth";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return {
      backgroundColor: "var(--buttonHoverBg)",
      borderRadius: "50%",
      padding: "10px",
    };
  }
};

const Navbar = ({ history }) => (
  <nav className="col-2">
    <Link to="#">
      <i className="fab fa-twitter"></i>
    </Link>
    <Link to="/" style={currentTab(history, "/")}>
      <i className="fas fa-home"></i>
    </Link>
    <Link to="/search" style={currentTab(history, "/search")}>
      <i className="fas fa-search"></i>
    </Link>
    <Link to="#">
      <i className="far fa-bell"></i>
    </Link>
    <Link to="/messages" style={currentTab(history, "/messages")}>
      <i className="far fa-envelope"></i>
    </Link>
    <Link
      to={`/profile/${isAuthenticated().data.user.email}`}
      style={currentTab(
        history,
        `/profile/${isAuthenticated().data.user.email}`
      )}
    >
      <i className="far fa-user"></i>
    </Link>
    {isAuthenticated() && (
      <span
        className="nav-link"
        onClick={() => {
          signout(() => {
            history.push("/signin");
          });
        }}
      >
        <i className="fas fa-sign-out-alt"></i>
      </span>
    )}
  </nav>
);

export default withRouter(Navbar);
