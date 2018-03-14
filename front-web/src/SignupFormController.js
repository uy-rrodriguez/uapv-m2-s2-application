import React, { Component } from "react";
import SignupForm from "./SignupForm";
//import $ from "jquery";
import isAuthenticated from "./helpers/isAuthenticated";
import BackREST from "./helpers/BackREST";
import { Redirect } from "react-router-dom";

class SignupFormController extends Component {
  constructor(props) {
    super(props);

    const roleList = {
      1: "Administrateur",
      2: "Manager",
      3: "Préparateur de commande"
    };

    this.state = {
      user: "picker",
      password: "picker",
      role: 3,
      maxWeight: 50,
      roleList: roleList
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleChangeSelect(event) {
    this.setState({[event.target.name]: parseInt(event.target.value, 0)});
  }

  handleSubmit(event) {
    event.preventDefault();
    
    let data = {
      user: this.state.user,
      password: this.state.password,
      maxWeight: this.state.maxWeight,
      role: this.state.roleList[this.state.role],
    };
    
    BackREST.post("signin", data)
      .then((responseJson) => {
        if (responseJson.result) {
          alert("L'utilisateur a bien été créé");
          this.setState({user: "", password: "", maxWeight: 0, role: 3});
        }
        else {
          alert("Error: " + JSON.stringify(responseJson.message));
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });
      
    /*
    $.ajax({
      url: "http://localhost:4000/signup",
      method: "POST",
      data: {
        user: this.state.user,
        password: this.state.password,
        maxWeight: this.state.maxWeight,
        role: this.state.roleList[this.state.role],
      },

      success(data, textStatus, jqXHR) {
        alert(JSON.stringify(data));
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
    */
  }

  render() {
    if (! isAuthenticated()) {
      return <Redirect to="/login" />;
    }

    return <SignupForm
      user={this.state.user}
      password={this.state.password}
      role={this.state.role}
      maxWeight={this.state.maxWeight}
      roleList={this.state.roleList}
      onChange={this.handleChange}
      onChangeSelect={this.handleChangeSelect}
      onSubmit={this.handleSubmit} />;
  }
}

export default SignupFormController;