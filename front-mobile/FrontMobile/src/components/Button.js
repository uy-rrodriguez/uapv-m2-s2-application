import React, {Component} from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native';

class Button extends Component {
  render() {
    return (
      <TouchableNativeFeedback
        onPress={this.props.onPress}
        background={TouchableNativeFeedback.SelectableBackground()}>

        <View style={[styles.defaultView, styles.shadowView, this.props.style]}>
          <Text style={[styles.defaultText, this.props.styleText]}>{this.props.title.toUpperCase()}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

const styles = StyleSheet.create({
  defaultView: {
    margin: 5,
    padding: 15,
    paddingLeft: 25,
    paddingRight: 25,
    minWidth: 150,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },

  defaultText: {
    fontSize: 14,
    textAlign: "center",
    color: '#333333',
  },
});

export default Button;
