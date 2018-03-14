import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import LoginForm from "./LoginForm";
//import $ from "jquery";
import globalEmitter from "./helpers/globalEmitter";
import startSession from "./helpers/startSession";
import isAuthenticated from "./helpers/isAuthenticated";
import BackREST from "./helpers/BackREST";

class LoginFormController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "admin",
      password: "admin"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    
    let data = {
      user: this.state.user,
      password: this.state.password
    };
    
    BackREST.post("login", data)
      .then((responseJson) => {
        if (responseJson.result) {
          // Initialize user session
          startSession(responseJson.user);

          // Send a signal to indicate that the user has been successfully logged in
          globalEmitter.emit('afterLogin');

          // Redirect to home page
          const { history } = this.props;
          history.push('/');
        }
        else {
          alert("Error: " + responseJson.message);
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });
    
    /*
    let _this = this;
    
    $.ajax({
      url: "http://localhost:4000/login",
      method: "POST",
      data: {
        user: _this.state.user,
        password: _this.state.password
      },

      success(data, textStatus, jqXHR) {
        //alert(JSON.stringify(data));

        if (data.result) {
          // Initialize user session
          startSession(data.user);

          // Send a signal to indicate that the user has been successfully logged in
          globalEmitter.emit('afterLogin');

          // Redirect to home page
          const { history } = _this.props;
          history.push('/');
        }
        else {
          alert("Error: " + data.message);
        }
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
    */
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