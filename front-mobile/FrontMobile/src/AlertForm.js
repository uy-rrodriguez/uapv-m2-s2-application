import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import PropTypes from "prop-types";
import Button from "./components/Button";

class AlertForm extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.h3}>Produit : {this.props.product.name}</Text>
        <TextInput name="stock" value={"" + this.props.stock} onChangeText={this.props.onChangeStock}
                   style={styles.input} keyboardType={"numeric"} />
        <Button title="Envoyer" onPress={this.props.onSubmit} style={styles.btnSubmit} styleText={styles.btnSubmitText} />
      </View>
    );
  }
}

AlertForm.propTypes = {
  stock: PropTypes.number.isRequired,
  onChangeStock: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },

  h3: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20
  },

  input: {
    minWidth: 200,
    height: 50,
    fontSize: 16,
    textAlign: "center"
  },

  btnSubmit: {
    backgroundColor: "#3399EE",
  },

  btnSubmitText: {
    color: "#EFEFEF",
  },
});

export default AlertForm;