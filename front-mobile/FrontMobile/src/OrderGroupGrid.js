import React, {Component} from "react";
import {StyleSheet, Text, View, TouchableNativeFeedback, Alert} from 'react-native';
import Button from "./components/Button";

class PickingRow extends Component {
  render() {
    const row = this.props.sectionList.map((section) =>
      <PickingSection
        key={section.row + "-" + section.column}
        section={section}
        onPress={this.props.onPress} />
    );

    return (
      <View style={styles.gridRow}>
        {row}
      </View>
    )
  }
}

class PickingSection extends Component {
  render() {
    let section = this.props.section;

    if (section.active) {
      let productList = section.productList.map((product, index) =>
        <Text key={"product-" + index} style={styles.sectionText}>
          {product.name}
        </Text>
      );

      return (
        <TouchableNativeFeedback
          onPress={this.props.onPress(section.row, section.column)}
          background={TouchableNativeFeedback.SelectableBackground()}>

          <View style={[styles.section, styles.sectionActive]}>
            <Text style={styles.sectionTitle}>[{section.row + "-" + section.column}]</Text>
            {productList}
          </View>

        </TouchableNativeFeedback>
      )
    }
    else {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>[{section.row + "-" + section.column}]</Text>
        </View>
      )
    }
  }
}

class OrderGroupGrid extends Component {
  constructor() {
    super();
  }

  render() {
    const gridRows = this.props.sectionGrid.map((row, rowIndex) =>
      <PickingRow
        key={"row-" + (rowIndex+1)}
        sectionList={row}
        onPress={this.props.onSectionPress} />
    );

    if (this.props.orderGroup) {
      return (
        <View style={styles.container}>
          <Text style={styles.h3}>Poids total: {parseFloat(this.props.orderGroup.total_weight).toFixed(2)} kg</Text>

          <View style={styles.gridContainer}>
            {gridRows}
          </View>

          <Button title="Finaliser" onPress={this.props.onConfirm} style={styles.btnSubmit} styleText={styles.btnSubmitText} />
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <Text style={styles.h3}>Création d'un nouveau regroupement en cours...</Text>
        </View>
      );
    }
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

  h3: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20
  },

  gridContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  gridRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    flex: 1,
    aspectRatio: 1,
    padding: 2,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#EEEEEE",
  },

  sectionActive: {
    borderColor: "#7070CC",
    backgroundColor: "#9090CC",
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },

  sectionText: {
    fontSize: 14,
    textAlign: "center",
  },

  btnSubmit: {
    backgroundColor: "#3399EE",
  },

  btnSubmitText: {
    color: "#EFEFEF",
  },
});

export default OrderGroupGrid;
