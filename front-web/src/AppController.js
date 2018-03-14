import React, { Component } from "react";
import App from "./App";
//import $ from "jquery";
import globalEmitter from "./helpers/globalEmitter";
import isAuthenticated from "./helpers/isAuthenticated";

class AppController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: this.getHeaderRoutes()
    };
  }

  getHeaderRoutes() {
    if (isAuthenticated()) {
      return [
        {name: "Home",              path: "/"},
        {name: "Sign up",           path: "/signup"},
        {name: "Alerts",            path: "/alert"},
        {name: "Users",             path: "/user"},
        /*{name: "New order group",   path: "/ordergroup"},*/
        {name: "List order groups", path: "/ordergrouplist"}
      ];
    }
    else {
      return [
        {name: "Home",              path: "/"},
        {name: "Login",             path: "/login"}
      ];
    }
  }

  componentDidMount() {
    let _this = this;

    globalEmitter.addListener('afterLogin', function() {
      _this.handleLogin();
    });

    globalEmitter.addListener('afterLogout', function() {
      _this.handleLogout();
    });
  }

  handleLogin() {
    this.setState({routes: this.getHeaderRoutes()});
  }

  handleLogout() {
    this.setState({routes: this.getHeaderRoutes()});
  }

  render() {
    return <App
      routes={this.state.routes} />;
  }
}

export default AppController;