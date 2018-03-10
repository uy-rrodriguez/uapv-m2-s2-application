import React, { Component } from "react";
import UserList from "./UserList";
import $ from "jquery";
import isAuthenticated from "./helpers/isAuthenticated";
import { Redirect } from "react-router-dom";

class UserListController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };

    this.load();
  }

  load() {
    let _this = this;

    $.ajax({
      url: "http://localhost:4000/user",
      method: "GET",

      success(data, textStatus, jqXHR) {
        _this.setState({users: data});
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
  }

  render() {
    if (! isAuthenticated()) {
      return <Redirect to="/login" />;
    }

    return <UserList
      users={this.state.users} />;
  }
}

export default UserListController;