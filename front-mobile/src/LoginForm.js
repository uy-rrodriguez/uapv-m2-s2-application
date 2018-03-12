import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import PropTypes from "prop-types";
import Button from "./components/Button";

class LoginForm extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>Login form</Text>
        <TextInput name="user" value={this.props.user} onChangeText={this.props.onChangeUser}
                   style={styles.input} placeholder="User name" />
        <TextInput name="password" value={this.props.password} onChangeText={this.props.onChangePassword}
                   secureTextEntry={true} style={styles.input} placeholder="Password" />
        <Button title="Submit" onPress={this.props.onSubmit} style={styles.btnSubmit} styleText={styles.btnSubmitText} />
      </View>
    );
  }
}

LoginForm.propTypes = {
  user: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onChangeUser: PropTypes.func.isRequired,
  onChangePassword: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  h1: {
    fontSize: 22,
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

export default LoginForm;