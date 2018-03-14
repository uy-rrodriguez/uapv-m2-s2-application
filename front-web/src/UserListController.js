import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import UserList from "./UserList";
//import $ from "jquery";
import isAuthenticated from "./helpers/isAuthenticated";
import BackREST from "./helpers/BackREST";

class UserListController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }
  
  componentDidMount() {
    this.load();
  }

  load() {
    BackREST.get("user")
      .then((responseJson) => {
        if (responseJson.result) {
          this.setState({users: responseJson.users});
        }
        else {
          alert("Error: " + responseJson.message);
        }
      })
      .catch((error) => {
        alert("Error: " + error);
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