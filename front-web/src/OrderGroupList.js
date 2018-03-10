import React, { Component } from "react";
import "./assets/css/OrderGroupList.css";
import PropTypes from "prop-types";

class OrderGroupList extends Component {
  render() {
    const orderGroupList = this.props.orderGroups.map((orderGroup) => {

      let orderList = orderGroup.orders.map((order) => {

        let productList = order.orderlines.map((orderLine) =>
          <tr key={orderGroup.id + "-" + order.id + "-" + orderLine.product.id}>
            <td>{orderLine.product.id}</td>
            <td>{orderLine.product.name}</td>
            <td>{orderLine.product.weight}</td>
            <td>{orderLine.quantity}</td>
          </tr>
        );

        return (
          <div key={orderGroup.id + "-" + order.id}>
            <h3>Ordre {order.id}</h3>
            <h4>{order.date} | {order.client}</h4>

            <table className="table">
              <thead>
              <tr>
                <th scope="col">Produit #</th>
                <th scope="col">Libellé</th>
                <th scope="col">Poids</th>
                <th scope="col">Quantité</th>
              </tr>
              </thead>
              <tbody>
                {productList}
              </tbody>
            </table>
          </div>
        );
      });

      return (
        <tr key={orderGroup.id}>
          <th scope="row">{orderGroup.id}</th>
          <td>{orderGroup.picker.name}</td>
          <td>{orderGroup.total_weight}</td>
          <td>
            {orderList}
          </td>
        </tr>
      );
    });

    return (
      <div className="OrderGroupList-wrapper">
        <h1>OrderGroups</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Picker assigné</th>
              <th scope="col">Poids total</th>
            </tr>
          </thead>
          <tbody>
            {orderGroupList}
          </tbody>
        </table>
      </div>
    );
  }
}

OrderGroupList.propTypes = {
  orderGroups: PropTypes.array.isRequired
};

export default OrderGroupList;
