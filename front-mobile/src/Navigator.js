import React from "react";
import { StackNavigator } from 'react-navigation';
import Home from "./Home";

const Navigator = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      title: "Home"
    }
  },
});

export default Navigator;