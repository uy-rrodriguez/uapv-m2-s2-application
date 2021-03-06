import React, { Component } from "react";
import PropTypes from "prop-types";
import "./assets/css/LoginForm.css";

class LoginForm extends Component {
  render() {
    return (
      <div>
        <h1>Login form</h1>
        <form onSubmit={this.props.onSubmit} className="LoginForm-form">
          <div className="form-group">
            <input type="text" name="user" value={this.props.user}
                   onChange={this.props.onChange} className="form-control" placeholder="User name" />
          </div>
          <div className="form-group">
            <input type="password" name="password" value={this.props.password}
                   onChange={this.props.onChange} className="form-control" placeholder="Password" />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

/* https://reactjs.org/docs/typechecking-with-proptypes.html */
LoginForm.propTypes = {
  user: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default LoginForm;