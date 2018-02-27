import React, { Component } from "react";
import "./assets/css/AlertList.css";
import PropTypes from "prop-types";

class AlertList extends Component {
  render() {
    const listItems = this.props.alerts.map((alert, key) =>
      <tr key={key} className={alert.urgent ? "AlertList-item-urgent" : ""} >
        <th scope="row">{alert.key}</th>
        <td>{alert.product.id}</td>
        <td>{alert.product.name}</td>
        <td>{alert.itemsLeft}</td>
        <td>
          <form className="form-inline" action="#">
            <input name="newStock" type="number" value={0} className="form-control" />
            <button type="submit" className="btn btn-default">
              <span className="glyphicon glyphicon-ok" aria-hidden="true" />
            </button>
          </form>
        </td>
      </tr>
    );

    return (
      <div className="AlertList-wrapper">
        <h1>Alertes de stock</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col"># Produit</th>
              <th scope="col">Libellé produit</th>
              <th scope="col">Stock restant</th>
              <th scope="col">Nouveau stock</th>
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

AlertList.propTypes = {
  alerts: PropTypes.array.isRequired
};

export default AlertList;
