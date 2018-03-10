import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Navbar, Nav} from "react-bootstrap";

//import logo from "./assets/img/logo.svg";
import "./assets/css/App.css";

import LoginFormController from "./LoginFormController";
import SignupFormController from "./SignupFormController";
import AlertListController from "./AlertListController";
import UserListController from "./UserListController";
import OrderGroupController from "./OrderGroupController";
import OrderGroupListController from "./OrderGroupListController";
import PropTypes from "prop-types";
import HomeController from "./HomeController";
import RouteNavItem from "./components/RouteNavItem";
import ButtonLogoutController from "./ButtonLogoutController";


class App extends Component {
  render() {
    const listRoutes = this.props.routes.map((route, key) =>
      <RouteNavItem key={key} href={route.path}>{route.name}</RouteNavItem>
    );

    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <Navbar>
              <Navbar.Header>
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#App-header-menu" aria-expanded="false">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                </button>
                <Navbar.Brand>
                  <Link to="/" onClick={this.props.onNavigation}>89Dis</Link>
                </Navbar.Brand>
              </Navbar.Header>

              <Nav>
                {listRoutes}
              </Nav>

              <Route component={ButtonLogoutController} />
            </Navbar>
          </header>

          <div className="container">
            <Route exact path="/" component={HomeController} />
            <Route path="/login" component={LoginFormController} />
            <Route path="/signup" component={SignupFormController} />
            <Route path="/alert" component={AlertListController} />
            <Route path="/user" component={UserListController} />
            <Route path="/ordergroup" component={OrderGroupController} />
            <Route path="/ordergrouplist" component={OrderGroupListController} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  routes: PropTypes.array.isRequired
};

export default App;
