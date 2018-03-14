import React, {Component} from "react";
import {StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';

class RackRow extends Component {
  render() {
    const row = this.props.rackCellList.map((rackCell) =>
      <RackCell
        key={rackCell.row + "-" + rackCell.column}
        rackCell={rackCell}
        onPress={this.props.onPress} />
    );

    return (
      <View style={styles.gridRow}>
        {row}
      </View>
    )
  }
}

class RackCell extends Component {
  render() {
    let rackCell = this.props.rackCell;

    if (rackCell.active) {
      return (
        <TouchableNativeFeedback
          onPress={this.props.onPress(rackCell.row, rackCell.column)}
          background={TouchableNativeFeedback.SelectableBackground()}>

          <View style={[styles.rackCell, styles.rackCellActive]}>
            <Text style={styles.rackCellTitle}>[{rackCell.row + "-" + rackCell.column}]</Text>
            <Text style={styles.rackCellText}>{rackCell.product.name}</Text>
            <Text style={styles.rackCellText}>{rackCell.quantity}x</Text>
            <Text style={styles.rackCellText}>{rackCell.quantity * rackCell.product.weight} kg</Text>
          </View>

        </TouchableNativeFeedback>
      )
    }
    else {
      return (
        <View style={styles.rackCell}>
          <Text style={styles.rackCellTitle}>[{rackCell.row + "-" + rackCell.column}]</Text>
        </View>
      )
    }
  }
}

class OrderGroupRack extends Component {
  render() {
    const rackRows = this.props.rack.map((row, rowIndex) =>
      <RackRow
        key={"row-" + rowIndex}
        rackCellList={row}
        onPress={this.props.onRackCellPress} />
    );

    return (
      <View style={styles.container}>
        <Text style={styles.h3}>Rack dans Section : {this.props.section.row}-{this.props.section.column}</Text>

        <View style={styles.gridContainer}>
          {rackRows}
        </View>
      </View>
    );
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

  rackCell: {
    flex: 1,
    aspectRatio: 1,
    padding: 2,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#EEEEEE",
  },

  rackCellActive: {
    borderColor: "#CC7070",
    backgroundColor: "#CC9090",
  },

  rackCellTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },

  rackCellText: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default OrderGroupRack;
