import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

//import logo from "./assets/img/logo.svg";
import "./assets/css/App.css";

import LoginFormController from "./LoginFormController";
import SignupFormController from "./SignupFormController";
import AlertListController from "./AlertListController";
import UserListController from "./UserListController";
import OrderGroupController from "./OrderGroupController";
import OrderGroupListController from "./OrderGroupListController";
import PropTypes from "prop-types";


class App extends Component {
  render() {
    const listRoutes = this.props.routes.map((route, key) =>
      <li key={key} className={window.location.href.match("" + route.path + "$") ? "active" : ""}>
        <Link to={route.path} onClick={this.props.onNavigation}>{route.name}</Link>
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
                  <Link className="navbar-brand" to="/" onClick={this.props.onNavigation}>89Dis</Link>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                    {listRoutes}
                  </ul>
                  <button type="button" className="btn btn-danger App-btn-logout" onClick={this.props.onLogout}>Log out</button>
                </div>
              </div>
            </nav>
          </header>

          <Route exact path="/(login)?" component={LoginFormController} />
          <Route path="/signup" component={SignupFormController} />
          <Route path="/alert" component={AlertListController} />
          <Route path="/user" component={UserListController} />
          <Route path="/ordergroup" component={OrderGroupController} />
          <Route path="/ordergrouplist" component={OrderGroupListController} />
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  routes: PropTypes.array.isRequired,
  onNavigation: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default App;
