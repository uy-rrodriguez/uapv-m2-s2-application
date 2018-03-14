import React, {Component} from "react";
import { Redirect } from "react-router-dom";
import AlertList from "./AlertList";
//import $ from "jquery";
import isAuthenticated from "./helpers/isAuthenticated";
import BackREST from "./helpers/BackREST";

class AlertListController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: [],
      alertsDict: []
    };

    this.handleStockChange = this.handleStockChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
    this.load();
  }

  load() {
    BackREST.get("alert")
      .then((responseJson) => {
        if (responseJson.result) {
          let alertsDict = {};
          let alerts = responseJson.alerts;
          alerts.forEach(function (item) {
            alertsDict[item.id] = item;
            item.newStock = item.stock;
          });

          this.setState({alerts: alerts});
          this.setState({alertsDict: alertsDict});
        }
        else {
          alert("Error: " + responseJson.message);
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  }

  handleStockChange(alertId, event) {
    let _alert = this.state.alertsDict[alertId];
    _alert.newStock = event.target.value;

    this.setState({
      alerts: this.state.alerts,
      alertsDict: this.state.alertsDict
    });
  }

  handleSubmit(alertId, event) {
    event.preventDefault();

    let data = {
      stock: this.state.alertsDict[alertId].newStock
    };
    
    BackREST.del("alert/" + alertId, data)
      .then((responseJson) => {
        if (responseJson.result) {
          alert("L'alerte de produit a bien été corrigée");
          this.load();
        }
        else {
          alert("Error: " + responseJson.message);
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });
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