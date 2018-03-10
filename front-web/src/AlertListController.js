import React, {Component} from "react";
import AlertList from "./AlertList";
import $ from "jquery";
import isAuthenticated from "./helpers/isAuthenticated";
import { Redirect } from "react-router-dom";

class AlertListController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: [],
      alertsDict: []
    };

    this.handleStockChange = this.handleStockChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.load();
  }

  load() {
    let _this = this;

    $.ajax({
      url: "http://localhost:4000/alert",
      method: "GET",

      success(data, textStatus, jqXHR) {
        let alertsDict = {};
        data.forEach(function (item) {
          alertsDict[item.id] = item;
          item.newStock = item.stock;
        });

        _this.setState({alerts: data});
        _this.setState({alertsDict: alertsDict});
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
  }

  handleStockChange(alertId, event) {
    //this.setState({[event.target.name]: event.target.value});
    let _alert = this.state.alertsDict[alertId];
    _alert.newStock = event.target.value;

    this.setState({
      alerts: this.state.alerts,
      alertsDict: this.state.alertsDict
    });

    //this.state.alertsDict[alertId].stock = event.target.value;
    alert("UPDATE alert " + alertId + ", new stock = " + event.target.value);
  }

  handleSubmit(alertId, event) {
    event.preventDefault();

    alert("SUBMIT alert " + alertId + ", new stock = " + this.state.alertsDict[alertId].newStock);

    /*
    $.ajax({
      url: "http://localhost:4000/login",
      method: "POST",
      data: this.state,

      success(data, textStatus, jqXHR) {
        alert(JSON.stringify(data));
      },

      error(jqXHR, textStatus, errorThrown) {
        alert("Error: " + textStatus);
      }
    });
    */
  }

  render() {
    if (! isAuthenticated()) {
      return <Redirect to="/login" />;
    }

    return <AlertList
      alerts={this.state.alerts}
      onStockChange={this.handleStockChange}
      onSubmit={this.handleSubmit} />;
  }
}

export default AlertListController;