import React, {Component} from "react";
import OrderGroupList from "./OrderGroupList";
import $ from "jquery";
import isAuthenticated from "./helpers/isAuthenticated";
import { Redirect } from "react-router-dom";

class OrderGroupListController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderGroups: []
    };

    this.load();
  }

  load() {
    let _this = this;

    $.ajax({
      url: "http://localhost:4000/ordergroup",
      method: "GET",

      success(data, textStatus, jqXHR) {
        let orderGroupList = data;

        // Load picker profiles asynchronously
        orderGroupList.forEach(function (orderGroup) {
          _this.loadPicker(orderGroup);
          orderGroup.picker = {id: 0, name: ""};
        });

        // Load products asynchronously
        _this.loadProducts(orderGroupList);
        
        _this.setState({orderGroups: data});
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
  }


  /**
   * Loads the picker information assigned to the given order group.
   *
   * @param orderGroup
   */
  loadPicker(orderGroup) {
    let _this = this;

    $.ajax({
      url: "http://localhost:4000/user/" + orderGroup.id_user,
      method: "GET",

      success(data, textStatus, jqXHR) {
        orderGroup.picker = data;
        _this.setState({orderGroups: _this.state.orderGroups});
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
  }


  /**
   * Loads from DB all products contained in the given list of order groups.
   *
   * @param orderGroupList
   */
  loadProducts(orderGroupList) {
    let _this = this;

    // First, we get all the product ids that will be searched and create an empty object
    // in a dictionary for each one of them.
    // We also create a new attribute "product" in the order instance linked to this empty object.
    let products = {};
    orderGroupList.forEach((orderGroup) => {
      orderGroup.orders.forEach((order) => {
        order.orderlines.forEach((orderLine) => {
          if (! products[orderLine.id_product]) {
            products[orderLine.id_product] = {
              id: orderLine.id_product,
              name: "",
              weight: 0
            };
          }

          orderLine.product = products[orderLine.id_product];
        });
      });
    });

    // Then, for each product, we search its data and update the empty object previously created.
    // So after this procedure all the orders that share a product will share the object containing its data.
    for (let id in products) {
      $.ajax({
        url: "http://localhost:4000/product/" + id,
        method: "GET",

        success(data, textStatus, jqXHR) {
          let productData = data;
          let productInMemory = products[id];
          productInMemory.id = productData.id;
          productInMemory.name = productData.name;
          productInMemory.weight = productData.weight;
          _this.setState({orderGroups: _this.state.orderGroups});
        },

        error(jqXHR, textStatus, errorThrown) {
          alert("Error: " + textStatus);
        }
      });
    }
  }

  render() {
    if (! isAuthenticated()) {
      return <Redirect to="/login" />;
    }

    return <OrderGroupList
      orderGroups={this.state.orderGroups} />;
  }
}

export default OrderGroupListController;