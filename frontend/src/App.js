import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Profile from "./components/Profile";
import PrivateRoute from "./components/auth/PrivateRoutes";
import Messenger from "./components/messenger/Messenger";
import Search from "./components/Search";
import ResetPassword from "./components/auth/Reset-Password";
import ForgotPassword from "./components/auth/Forgot-Password";
import PageNotFound from "./components/PageNotFound";

const App = () => {
  return (
    <>
      <Switch>
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/resetpassword/:token" component={ResetPassword} />

        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/profile/:email" component={Profile} />
        <PrivateRoute exact path="/messages" component={Messenger} />
        <PrivateRoute exact path="/search" component={Search} />
        <Route path="*" component={PageNotFound} />
      </Switch>
    </>
  );
};

export default App;
