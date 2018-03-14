import React, { Component } from "react";
import LoginForm from "./LoginForm";
import globalEmitter from "./helpers/globalEmitter";
import BackREST from "./helpers/BackREST";
import {Alert} from "react-native";

class LoginFormController extends Component {
  constructor() {
    super();
    this.state = {
      user: "picker",
      password: "picker"
    };

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
    let data = {
      "user": this.state.user,
      "password": this.state.password
    };
    
    BackREST.post("login", data)
      .then((responseJson) => {
        let result = responseJson.result;
        if (result) {
          //let user = responseJson.result;
          
          // Send a signal to indicate that the user has been successfully logged in
          globalEmitter.emit('afterLogin');
        }
        else {
          Alert.alert("Error", responseJson.message);
        }
      })
      .catch((error) => {
        Alert.alert("Error", "handleSubmit: " + JSON.stringify(error));
      });
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