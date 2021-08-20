import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "./auth/Auth";
import Navbar from "./Navbar";
import Widgets from "./Widgets";

const Search = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState([]);

  const fetchUser = (query) => {
    setSearch(query);
    axios
      .get("/search-user", {
        params: { firstName: query },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  console.log(user);
  return (
    <div className="container">
      <div className="row pt-2 pb-4">
        <Navbar />
        <div className="main-content-container col-10 col-md-8 col-lg-6">
          <div className="titleContainer">
            <h1 className="fw-bold ">Search User</h1>
          </div>
          <div className="textareaContainer mt-2">
            <input
              placeholder="Search for username"
              type="text"
              value={search}
              onChange={(e) => fetchUser(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "1rem",
              }}
            />
            <div
              className="collection"
              style={{
                marginTop: "1rem",
              }}
            >
              {user &&
                user.map((u, index) => {
                  return u && u ? (
                    <Link
                      style={{
                        listStyle: "none",
                        marginBottom: "1rem",
                        padding: "0.2rem",
                        fontSize: "1rem",
                        fontWeight: "bold",
                      }}
                      key={index}
                      to={
                        u._id !== isAuthenticated().data.user._id
                          ? "/profile/" + u.email
                          : "/profile/" + isAuthenticated().data.user.email
                      }
                      onClick={() => {
                        setSearch("");
                      }}
                    >
                      <li className="collection-item">{u.firstName}</li>
                    </Link>
                  ) : (
                    <li className="collection-item">User Not Found</li>
                  );
                })}
            </div>
          </div>
        </div>
        <Widgets />
      </div>
    </div>
  );
};

export default Search;
