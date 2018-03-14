import React, {Component} from "react";
import { Redirect } from "react-router-dom";
import OrderGroupList from "./OrderGroupList";
//import $ from "jquery";
import isAuthenticated from "./helpers/isAuthenticated";
import BackREST from "./helpers/BackREST";

class OrderGroupListController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderGroups: []
    };
  }
  
  componentDidMount() {
    this.load();
  }

  load() {
    BackREST.get("ordergrouplist")
      .then((responseJson) => {
        if (responseJson.result) {
          let orderGroupList = responseJson.order_group;

          // The returned object is not exactly as we expect, so we will transform it
          orderGroupList.forEach((orderGroup) => {
            orderGroup.picker = orderGroup.user;
            orderGroup.orders = orderGroup.order_group_line;
            orderGroup.orders.forEach((order) => {
              order.date = order.order.date;
              order.client = order.order.client;
              order.orderlines = order.order.order_line;
            });
          });
          
          // Load products asynchronously
          this.loadProducts(orderGroupList);
          
          // Update state
          this.setState({orderGroups: responseJson.order_group});
        }
        else {
          alert("Error: " + responseJson.message);
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  }


  /**
   * Loads the picker information assigned to the given order group.
   *
   * @param orderGroup
   */
   /*
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
  */


  /**
   * Loads from DB all products contained in the given list of order groups.
   *
   * @param orderGroupList
   */
  loadProducts(orderGroupList) {
    //let _this = this;

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
      BackREST.get("product/" + id)
        .then((responseJson) => {
          
          if (responseJson.result) {
            let productData = responseJson.product;
            let productInMemory = products[id];
            productInMemory.id = productData.id;
            productInMemory.name = productData.name;
            productInMemory.weight = productData.weight;
            this.setState({orderGroups: this.state.orderGroups});
          }
          else {
            alert("Error: " + responseJson.message);
          }
          
        })
        .catch((error) => {
          alert("Error: " + error);
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