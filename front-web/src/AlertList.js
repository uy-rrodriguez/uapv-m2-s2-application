import React, { Component } from "react";
import "./assets/css/AlertList.css";
import PropTypes from "prop-types";

class AlertList extends Component {
  render() {
    const listItems = this.props.alerts.map((alert, alertId) =>
      <tr key={alert.id}>
        <th scope="row">{alert.id}</th>
        <td>{alert.product.id}</td>
        <td>{alert.product.name}</td>
        <td>{alert.stock}</td>
        <td>
          <form className="form-inline" action="#" onSubmit={(event) => this.props.onSubmit(alert.id, event)}>
            <input name="newStock" type="number" value={alert.newStock} className="form-control"
              onChange={(event) => this.props.onStockChange(alert.id, event)} />
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
  alerts: PropTypes.array.isRequired,
  onStockChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default AlertList;
