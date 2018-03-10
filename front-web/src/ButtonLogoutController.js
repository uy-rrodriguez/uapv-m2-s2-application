import React, { Component } from "react";
import ButtonLogout from "./ButtonLogout";
import removeSession from "./helpers/removeSession";
import globalEmitter from "./helpers/globalEmitter";
import isAuthenticated from "./helpers/isAuthenticated";

class ButtonLogoutController extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    /*
    $.ajax({
      url: "http://localhost:4000/logout",
      method: "GET",

      success(data, textStatus, jqXHR) {
        alert(JSON.stringify(data));

        this.props.history.push("/login");
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
    */

    // Delete session
    removeSession();

    // Send a signal to indicate that the user has been successfully logged in
    globalEmitter.emit('afterLogout');

    // Redirect to login page
    const { history } = this.props;
    history.push("/login");
  }

  render() {
    if (! isAuthenticated()) {
      return null;
    }

    return <ButtonLogout onClick={this.handleClick} />
  }
}

export default ButtonLogoutController;
