import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Calendar from "../Views/Calendar";
import Home from "../Views/Home";
import Login from "../Views/Login";
import Register from "../Views/Register";
import PrivateRoute from "./privateRoute";

function Routes(props) {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <PrivateRoute path="/calendar/:uri" exact component={Calendar} />
        <PrivateRoute path="/home" exact component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
