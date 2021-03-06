import React, { Component } from "react";
import AlertForm from "./AlertForm";
import BackREST from "./helpers/BackREST";
import {Alert} from "react-native";

class AlertFormController extends Component {
  constructor(props) {
    super(props);

    const {state} = props.navigation;

    this.state = {
      product: state.params.product,
      stock: state.params.product.stock
    };

    this.handleChangeStock = this.handleChangeStock.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeStock(text) {
    let stock = parseInt(text);
    if (isNaN(stock)) {
      stock = 0;
    }
    this.setState({stock: stock});
  }

  handleSubmit() {
    let data = {
      id_product: this.state.product.id,
      stock: this.state.stock
    };

    const { goBack } = this.props.navigation;

    BackREST.post("alert", data)
      .then((responseJson) => {
        if (responseJson.result) {
          Alert.alert("Alerte de stock", "Votre alerte a bien été créée");
          goBack();
        }
        else {
          Alert.alert("Alerte de stock", "Il y a eu une erreur pour créer l'alerte. " + responseJson.message);
        }
      })
      .catch((error) => {
        Alert.alert("Alerte de stock", "Il y a eu une erreur pour créer l'alerte. " + JSON.stringify(error));
      });
  }

  render() {
    return <AlertForm
      stock={this.state.stock}
      product={this.state.product}
      onChangeStock={this.handleChangeStock}
      onSubmit={this.handleSubmit} />;
  }
}

export default AlertFormController;