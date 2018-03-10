import React, { Component } from "react";
import "./assets/css/OrderGroup.css";
import PropTypes from "prop-types";

class PickingSection extends Component {
  render() {
    if (this.props.cell.active) {
      let cell = this.props.cell;

      return (
        <div className="active">
          <div><b>Section {this.props.row + "-" + this.props.col}</b></div>
          <div>{cell.product.name}</div>
          <div>Quantité : {cell.quantity}</div>
          <div>Poids total : {cell.quantity * cell.product.weight}</div>
        </div>
      )
    }
    else {
      return (
        <div>
          <div><b>Section {this.props.row + "-" + this.props.col}</b></div>
        </div>
      )
    }
  }
}

class OrderGroup extends Component {
  render() {
    const sectionGrid = this.props.sectionGrid.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        <PickingSection
          key={rowIndex + "-" + colIndex}
          cell={cell}
          row={rowIndex}
          col={colIndex} />
      )
    );

    return (
      <div className="OrderGroup-wrapper">
        <h1>OrderGroup {this.props.orderGroup.id}</h1>
        <table className="table">
          <tbody>
            <tr>
              <th scope="row">Id</th>
              <td>{this.props.orderGroup.id}</td>
            </tr>
            <tr>
              <th scope="row">Poids total</th>
              <td>{this.props.orderGroup.total_weight}</td>
            </tr>
          </tbody>
        </table>

        <div className="OrderGroup-grid-wrapper">
          <h1>Picking</h1>
          <div className="OrderGroup-grid">
            {sectionGrid}
          </div>
        </div>
      </div>
    );
  }
}

OrderGroup.propTypes = {
  orderGroup: PropTypes.object.isRequired,
  sectionGrid: PropTypes.array.isRequired
};

export default OrderGroup;
