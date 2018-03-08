import React, { Component } from "react";
import PropTypes from "prop-types";
import "./assets/css/RegisterForm.css";

class SignupForm extends Component {
  render() {
    const roleIds = [];
    for (let id in this.props.roleList) {
      roleIds.push(id);
    }

    const roleOptions = roleIds.map((roleId) =>
      <option key={"role-" + roleId} value={roleId}>{this.props.roleList[roleId]}</option>
    );

    return (
      <div>
        <h1>Sign up form</h1>
        <form onSubmit={this.props.onSubmit} className="RegisterForm-form">
          <div className="form-group">
            <input type="text" name="user" value={this.props.user}
                   onChange={this.props.onChange} className="form-control" placeholder="User name" />
          </div>
          <div className="form-group">
            <input type="password" name="password" value={this.props.password}
                   onChange={this.props.onChange} className="form-control" placeholder="Password" />
          </div>
          <div className="form-group">
            <select name="role" value={this.props.role}
                    onChange={this.props.onChangeSelect} className="form-control">
              {roleOptions}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

/* https://reactjs.org/docs/typechecking-with-proptypes.html */
SignupForm.propTypes = {
  user: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  role: PropTypes.number.isRequired,
  roleList: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeSelect: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default SignupForm;