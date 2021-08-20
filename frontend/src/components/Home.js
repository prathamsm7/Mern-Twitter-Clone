import React from "react";
import "./Home.css";
import Navbar from "./Navbar";
import Feed from "./Feed";
import Widgets from "./Widgets";

const Home = () => {
  return (
    <div className="container">
      <div className="row pt-2 pb-4">
        <Navbar />
        <Feed />
        <Widgets />
      </div>
    </div>
  );
};

export default Home;
