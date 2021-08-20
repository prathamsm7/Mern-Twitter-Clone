import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "2rem",
        margin: "15% auto",
        fontWeight: "bolder",
        color: "GrayText",
      }}
    >
      404 Page Not Found !!!
      <p>
        <Link to="/" style={{ fontSize: "2rem", fontWeight: "normal" }}>
          Go to Home{" "}
        </Link>
      </p>
    </div>
  );
};

export default PageNotFound;
