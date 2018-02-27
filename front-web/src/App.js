import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

//import logo from "./assets/img/logo.svg";
import "./assets/css/App.css";

import LoginFormController from "./LoginFormController";
import RegisterFormController from "./RegisterFormController";
import AlertListController from "./AlertListController";


class App extends Component {
  render() {
    const routes = [
      {name: "Home",      path: "/"},
      {name: "Login",     path: "/login"},
      {name: "Register",  path: "/register"},
      {name: "Alerts",    path: "/alerts"}
    ];

    const listRoutes = routes.map((route, key) =>
      <li key={key} className={window.location.href.match("" + route.path + "$") ? "active" : ""}>
        <Link to={route.path}>{route.name}</Link>
      </li>
    );

    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <nav className="navbar navbar-inverse">
              <div className="container-fluid">

                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                          data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                  <Link className="navbar-brand" to="/">Brand</Link>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">{listRoutes}</ul>
                </div>
              </div>
            </nav>
          </header>

          <Route exact path="/(login)?" component={LoginFormController} />
          <Route path="/register" component={RegisterFormController} />
          <Route path="/alerts" component={AlertListController} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
