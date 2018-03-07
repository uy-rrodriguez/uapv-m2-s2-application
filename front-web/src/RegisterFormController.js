import React, { Component } from "react";
import RegisterForm from "./RegisterForm";

import $ from "jquery";

class RegisterFormController extends Component {
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

    $.ajax({
      url: "http://localhost:4000/register",
      method: "POST",
      data: this.state,

      success(data, textStatus, jqXHR) {
        alert(JSON.stringify(data));
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
  }

  render() {
    return <RegisterForm
      user={this.state.user}
      password={this.state.password}
      onChange={this.handleChange}
      onSubmit={this.handleSubmit} />;
  }
}

export default RegisterFormController;