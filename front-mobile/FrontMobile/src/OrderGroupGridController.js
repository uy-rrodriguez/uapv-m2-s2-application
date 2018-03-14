import React, {Component} from "react";
import OrderGroupGrid from "./OrderGroupGrid";
import BackREST from "./helpers/BackREST";
import {Alert} from "react-native";

class SectionCell {
  constructor(row, column, active, productList) {
    this.row = row;
    this.column = column;
    this.active = active;
    this.productList = productList;
  }
}

class OrderGroupGridController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderGroup: {},
      productQuantityMap: {},
      sectionGrid: this.createEmptySectionGrid()
    };

    this.generateNewOrderGroup();

    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleSectionPress = this.handleSectionPress.bind(this);
  }


  /**
   * Creates an empty grid of sections
   *
   */
  createEmptySectionGrid() {
    const ROWS = 4;
    const COLS = 4;
    let grid = [];

    for (let rowIndex = 1; rowIndex <= ROWS; rowIndex++) {
      let row = [];
      for (let colIndex = 1; colIndex <= COLS; colIndex++) {
        row.push(new SectionCell(rowIndex, colIndex, false, []));
      }
      grid.push(row);
    }

    return grid;
  }

  
  /**
   * Gets a new order grid and then updates the section grid.
   *
   */
  generateNewOrderGroup() {
    BackREST.get("ordergroup/1").
      then((responseJson) => {
        if (responseJson.result) {
          let orderGroup = responseJson.orderGroup;

          // The returned object is not exactly as we expect, so we will transform it
          orderGroup.picker = orderGroup.user;
          orderGroup.orders = orderGroup.order_group_line;
          orderGroup.orders.forEach((order) => {
            order.date = order.order.date;
            order.client = order.order.client;
            order.orderlines = order.order.order_line;
          });
        
          this.setState({orderGroup: orderGroup});

          this.loadProductsAndQuantities(orderGroup);
        }
        else {
          Alert.alert("Error", "generate: " + responseJson.message);
        }
        
      })
      .catch((error) => {
        Alert.alert("Error", "generate: " + JSON.stringify(error));
      });
  }


  /**
   * Loads all the products in the given order group.
   * This will also set in the state an element called productQuantityMap, which contains
   * the quantity associated to each product id in the form of a dictionary (key = id, value = quantity).
   *
   * @param orderGroup
   */
  loadProductsAndQuantities(orderGroup) {
    let products = {};
    orderGroup.orders.forEach((order) => {
      order.orderlines.forEach((line) => {
        if (products[line.id_product]) {
          products[line.id_product].quantity += line.quantity;
        }
        else {
          products[line.id_product] = {
            id:       line.id_product,
            quantity: line.quantity
          };
        }
      });
    });

    for (let id in products) {
      this.loadProduct(id, products[id].quantity);
    }

    // Update state
    this.setState({productQuantityMap: products});
  }


  /**
   * Searches for the product by its id and updates the corresponding cell in the grid of sections.
   *
   * @param id
   */
  loadProduct(id) {
    BackREST.get("product/" + id)
      .then((responseJson) => {
        if (responseJson.result) {
          let product = responseJson.product;
          let section = product.rack.section;

          // Update the grid cell with the product data
          let gridCell = this.state.sectionGrid[section.row-1][section.column-1];
          gridCell.productList.push(product);
          gridCell.active = true;

          // Update state
          this.setState({sectionGrid: this.state.sectionGrid});
        }
        else {
          Alert.alert("Error", "loadProduct: " + responseJson.message);
        }
      })
      .catch((error) => {
        Alert.alert("Error", "loadProduct: " + JSON.stringify(error));
      });
  }


  /**
   * Handle confirmation after completing an order group.
   *
   */
  handleConfirm() {
    Alert.alert(
      "Finaliser le regroupement de commandes",
      "Avant de finaliser ce bon, veuillez indiquer s'il est complet ou incomplet.",
      [
        {text: 'Complet', onPress: () => this.sendConfirm(true) },
        {text: 'Incomplet', onPress: () => this.sendConfirm(false) }
      ],
      { cancelable: true }
    )
  }

  sendConfirm(complete) {
    let completeStr = (complete ? "complete" : "incomplete");
    Alert.alert(completeStr, completeStr);

    const { goBack } = this.props.navigation;
    goBack();
  }


  /**
   * Handle click on a section. We will open a new page showing the rack details.
   *
   */
  handleSectionPress = (row, column) => () => {
    let section = this.state.sectionGrid[row-1][column-1];

    const { navigation } = this.props;
    navigation.navigate("OrderGroupRack", {
      section: section,
      productQuantityMap: this.state.productQuantityMap,
    });
  };


  render() {
    return <OrderGroupGrid
      orderGroup={this.state.orderGroup}
      sectionGrid={this.state.sectionGrid}
      onConfirm={this.handleConfirm}
      onSectionPress={this.handleSectionPress} />;
  }
}

export default OrderGroupGridController;