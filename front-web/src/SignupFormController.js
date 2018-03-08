import React, { Component } from "react";
import SignupForm from "./SignupForm";

import $ from "jquery";

class SignupFormController extends Component {
  constructor(props) {
    super(props);

    const roleList = {
      1: "Picker",
      2: "Manager",
      3: "Administrator"
    };

    this.state = {
      user: "",
      password: "",
      role: 1,
      roleList: roleList
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleChangeSelect(event) {
    this.setState({[event.target.name]: parseInt(event.target.value, 0)});
  }

  handleSubmit(event) {
    event.preventDefault();

    $.ajax({
      url: "http://localhost:4000/signup",
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
    return <SignupForm
      user={this.state.user}
      password={this.state.password}
      role={this.state.role}
      roleList={this.state.roleList}
      onChange={this.handleChange}
      onChangeSelect={this.handleChangeSelect}
      onSubmit={this.handleSubmit} />;
  }
}

export default SignupFormController;