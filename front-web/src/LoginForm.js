import $ from 'jquery';

import React, { Component } from 'react';
import './LoginForm.css';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {user: '', password: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.name === 'user')
      this.setState({user: event.target.value});

    else if (event.target.name === 'password')
      this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    $.ajax({
      url: 'http://localhost:4000/login',
      method: 'POST',
      data: this.state,

      success: function (data, textStatus, jqXHR) {
        console.log(JSON.stringify(data));
      },

      error: function (jqXHR, textStatus, errorThrown) {
        console.error(textStatus);
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="LoginForm-form">
        <div className="form-group">
          <input type="text" name="user" value={this.state.value}
                 onChange={this.handleChange} className="form-control" placeholder="User name" />
        </div>
        <div className="form-group">
          <input type="password" name="password" value={this.state.value}
                 onChange={this.handleChange} className="form-control" placeholder="Password" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    );
  }
}

export default LoginForm;