import React, { Component } from "react";
import AlertList from "./AlertList";

class AlertListController extends Component {
  constructor(props) {
    super(props);
    this.state = {alerts: []};
    this.state = {
      alerts: [
        {
          key: 1,
          product: {id: 15, name: "Product 15"},
          placement: "A3",
          itemsLeft: 0,
          urgent: true
        },
        {
          key: 2,
          product: {id: 8, name: "Product 8"},
          placement: "B1",
          itemsLeft: 3,
          urgent: false
        },
        {
          key: 3,
          product: {id: 35, name: "Product 35"},
          placement: "C5",
          itemsLeft: 1,
          urgent: false
        }
      ]
    };
  }

  render() {
    return <AlertList alerts={this.state.alerts} />;
  }
}

export default AlertListController;