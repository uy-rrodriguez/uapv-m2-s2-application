import React, { Component } from "react";
//import logo from "./assets/img/logo.svg";
import "./assets/css/ButtonLogout.css";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

class ButtonLogout extends Component {
  render() {
    return (
      <Button onClick={this.props.onClick} className="btn-danger ButtonLogout">
        Log out
      </Button>
    )
  }
}

ButtonLogout.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default ButtonLogout;
