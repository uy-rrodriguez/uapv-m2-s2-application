import React, { Component } from "react";

import App from "./App";
import $ from "jquery";

class AppController extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.routes = [
      {name: "Home",              path: "/"},
      {name: "Login",             path: "/login"},
      {name: "Sign up",           path: "/signup"},
      {name: "Alerts",            path: "/alert"},
      {name: "Users",             path: "/user"},
      {name: "New order group",   path: "/ordergroup"},
      {name: "List order groups", path: "/ordergrouplist"}
    ];
    this.state.location = "/";

    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleNavigation(event) {
    // Change class of active link
    $(".App-header .nav .active").removeClass("active");
    $(event.target).parent().addClass("active");
  }

  handleLogout(event) {
    /*
    $.ajax({
      url: "http://localhost:4000/logout",
      method: "GET",

      success(data, textStatus, jqXHR) {
        alert(JSON.stringify(data));

        this.props.history.push("/login");
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
    */
    window.location.href = "/login";
  }

  render() {
    return <App
      routes={this.state.routes}
      onNavigation={this.handleNavigation}
      onLogout={this.handleLogout} />;
  }
}

export default AppController;