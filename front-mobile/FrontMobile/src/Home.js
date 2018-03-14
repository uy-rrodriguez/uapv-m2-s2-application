import React, {Component} from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import globalEmitter from "./helpers/globalEmitter";
import Button from "./components/Button";

class Home extends Component {
  constructor() {
    super();
    this.handleGetOrderGroup = this.handleGetOrderGroup.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleGetOrderGroup() {
    const { navigation } = this.props;
    navigation.navigate("OrderGroup");
  }

  handleLogout() {
    // Send a signal to indicate that the user has been successfully logged in
    globalEmitter.emit("afterLogout");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>Bienvenu à la meilleure aplication de gestion de picking !</Text>
        <Text>Utilisez le menu de gauche pour accéder aux différentes fonctionnalités.</Text>
        <Text>Pour feedback, n'hésitez pas à nous contacter via la page GitHub du projet :</Text>

        <Button onPress={() => Linking.openURL("https://github.com/uy-rrodriguez/uapv-m2-s2-application/")
                                      .catch(err => console.error('An error occurred opening URL', err))}
                title="Aller au site" />

        <Button title="Nouvelles commandes" onPress={this.handleGetOrderGroup} style={styles.btnAction}
                styleText={styles.btnActionText} />

        <Button title="Logout" onPress={this.handleLogout} style={styles.btnLogout} styleText={styles.btnLogoutText} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    paddingTop: 20,
  },

  h1: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },

  btnAction: {
    backgroundColor: "#3399EE",
  },

  btnActionText: {
    color: "#EFEFEF",
  },

  btnLogout: {
    backgroundColor: "#EE2222",
  },

  btnLogoutText: {
    color: "#EFEFEF",
  },
});

export default Home;
