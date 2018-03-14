import React, { Component } from "react";
import LoginForm from "./LoginForm";
import globalEmitter from "./helpers/globalEmitter";

class LoginFormController extends Component {
  constructor() {
    super();
    this.state = {user: "", password: ""};

    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeUser(text) {
    this.setState({user: text});
  }

  handleChangePassword(text) {
    this.setState({password: text});
  }

  handleSubmit() {
    // Send a signal to indicate that the user has been successfully logged in
    globalEmitter.emit('afterLogin');
  }

  render() {
    return <LoginForm
      user={this.state.user}
      password={this.state.password}
      onChangeUser={this.handleChangeUser}
      onChangePassword={this.handleChangePassword}
      onSubmit={this.handleSubmit} />;
  }
}

export default LoginFormController;