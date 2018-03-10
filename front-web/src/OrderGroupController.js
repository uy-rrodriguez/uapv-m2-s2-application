import React, {Component} from "react";
import OrderGroup from "./OrderGroup";
import $ from "jquery";
import isAuthenticated from "./helpers/isAuthenticated";
import { Redirect } from "react-router-dom";

class SectionCell {
  constructor(row, column, active, product, quantity) {
    this.row = row;
    this.column = column;
    this.active = active;
    this.product = product;
    this.quantity = quantity;
  }
}

class OrderGroupController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderGroup: {},
      sectionGrid: this.createEmptySectionGrid()
    };

    this.generate();
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
        row.push(new SectionCell(rowIndex, colIndex, false, null, 0));
      }
      grid.push(row);
    }

    return grid;
  }


  /**
   * Loads the grid of sections with the given order group data.
   *
   * @param orderGroup
   */
  loadSectionGrid(orderGroup) {
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
  }


  /**
   * Search for the product by its id and updates the corresponding cell in the grid of sections.
   *
   * @param id
   * @param quantity
   */
  loadProduct(id, quantity) {
    let _this = this;

    $.ajax({
      url: "http://localhost:4000/product/" + id,
      method: "GET",

      success(data, textStatus, jqXHR) {
        let product = data;
        let section = product.rack.section;

        // Update the grid cell with the product data
        let gridCell = _this.state.sectionGrid[section.row-1][section.column-1];
        gridCell.product = product;
        gridCell.quantity = quantity;
        gridCell.active = true;

        // Update state
        _this.setState({sectionGrid: _this.state.sectionGrid});
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
  }


  /**
   * Gets a new order grid and then updates the section grid.
   *
   */
  generate() {
    let _this = this;

    $.ajax({
      url: "http://localhost:4000/ordergroup/1",
      method: "GET",

      success(data, textStatus, jqXHR) {
        let orderGroup = data;

        _this.setState({orderGroup: orderGroup});

        _this.loadSectionGrid(orderGroup);
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
  }

  render() {
    if (! isAuthenticated()) {
      return <Redirect to="/login" />;
    }

    return <OrderGroup
      orderGroup={this.state.orderGroup}
      sectionGrid={this.state.sectionGrid} />;
  }
}

export default OrderGroupController;