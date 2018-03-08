import React, { Component } from "react";
import "./assets/css/UserList.css";
import PropTypes from "prop-types";

class UserList extends Component {
  render() {
    const listItems = this.props.users.map((user) =>
      <tr key={user.id}>
        <th scope="row">{user.id}</th>
        <td>{user.name}</td>
        <td>{user.id_role}</td>
        <td>{user.max_weight}</td>
      </tr>
    );

    return (
      <div className="UserList-wrapper">
        <h1>Users</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Identifiant</th>
              <th scope="col">Rôle</th>
              <th scope="col">Poids maximum</th>
            </tr>
          </thead>
          <tbody>
            {listItems}
          </tbody>
        </table>
      </div>
    );
  }
}

UserList.propTypes = {
  users: PropTypes.array.isRequired
};

export default UserList;
