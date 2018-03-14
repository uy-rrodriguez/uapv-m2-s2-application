import React from "react";
import { StackNavigator } from 'react-navigation';
import Home from "./Home";
import OrderGroupGridController from "./OrderGroupGridController";
import OrderGroupRackController from "./OrderGroupRackController";
import AlertFormController from "./AlertFormController";

const Navigator = StackNavigator({
  Home: { screen: Home, navigationOptions: { title: "Home" } },
  OrderGroup: { screen: OrderGroupGridController, navigationOptions: { title: "Zone de picking" } },
  OrderGroupRack: { screen: OrderGroupRackController, navigationOptions: { title: "Produits dans le rack" } },
  Alert: { screen: AlertFormController, navigationOptions: { title: "Création d'alerte" } },
});

export default Navigator;