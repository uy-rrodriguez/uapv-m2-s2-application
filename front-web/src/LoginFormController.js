import React, { Component } from "react";
import LoginForm from "./LoginForm";
//import $ from "jquery";
import globalEmitter from "./helpers/globalEmitter";
import startSession from "./helpers/startSession";
import isAuthenticated from "./helpers/isAuthenticated";
import { Redirect } from "react-router-dom";

class LoginFormController extends Component {
  constructor(props) {
    super(props);
    this.state = {user: "", password: ""};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    /*
    $.ajax({
      url: "http://localhost:4000/login",
      method: "POST",
      data: this.state,

      success(data, textStatus, jqXHR) {
        alert(JSON.stringify(data));
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
    */

    // Initialize user session
    startSession({id: 1, name: "test"});

    // Send a signal to indicate that the user has been successfully logged in
    globalEmitter.emit('afterLogin');

    // Redirect to home page
    const { history } = this.props;
    history.push('/');
  }

  render() {
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }

    return <LoginForm
      user={this.state.user}
      password={this.state.password}
      onChange={this.handleChange}
      onSubmit={this.handleSubmit} />;
  }
}

export default LoginFormController;