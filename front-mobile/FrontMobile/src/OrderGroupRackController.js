import React, {Component} from "react";
import OrderGroupRack from "./OrderGroupRack";
//import BackREST from "./helpers/BackREST";
import {Alert} from "react-native";

class RackCell {
  constructor(row, column, active, product, quantity) {
    this.row = row;
    this.column = column;
    this.active = active;
    this.product = product;
    this.quantity = quantity;
  }
}

class OrderGroupRackController extends Component {
  constructor(props) {
    super(props);

    const {state} = props.navigation;

    this.state = {
      section: state.params.section,
      productQuantityMap: state.params.productQuantityMap,
      rack: this.createEmptyRack()
    };

    this.loadRack(this.state.section.productList);

    this.handleRackCellPress = this.handleRackCellPress.bind(this);
  }


  /**
   * Creates an empty rack, in the form of a two dimensions array
   *
   */
  createEmptyRack() {
    const ROWS = 3;
    const COLS = 3;
    let rack = [];

    for (let rowIndex = 1; rowIndex <= ROWS; rowIndex++) {
      let row = [];
      for (let colIndex = 1; colIndex <= COLS; colIndex++) {
        row.push(new RackCell(rowIndex, colIndex, false, null, 0));
      }
      rack.push(row);
    }

    return rack;
  }


  /**
   * Puts in the rack the content given by the product list.
   *
   * @param productList
   */
  loadRack(productList) {
    productList.forEach((product) => {
      let rackCell = this.state.rack[product.rack.row-1][product.rack.column-1];
      rackCell.product = product;
      rackCell.active = true;
      rackCell.quantity = this.state.productQuantityMap[product.id].quantity;
    });

    // Update state
    //this.setState({rack: this.state.rack});
  }


  /**
   * Handle click on a section. We will open a new page showing the rack details.
   *
   */
  handleRackCellPress = (row, column) => () => {
    let rackCell = this.state.rack[row-1][column-1];

    const { navigation } = this.props;
    navigation.navigate("Alert", {
      product: rackCell.product
    });
  };


  render() {
    return <OrderGroupRack
      rack={this.state.rack}
      section={this.state.section}
      onRackCellPress={this.handleRackCellPress} />;
  }
}

export default OrderGroupRackController;