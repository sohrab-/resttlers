import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./utils/withRoot";
import TitleBar from "./components/TitleBar";
import Board from "./components/Board";

const buildingTypes = {
  quarry: {
    consumes: ["stoneDeposit"],
    produces: ["stone"]
  },
  woodcutter: {
    consumes: ["tree"],
    produces: ["lumber"]
  },
  goldMine: {
    consumes: ["meat", "fish", "bread"],
    produces: ["goldOre"]
  },
  waterworks: {
    produces: ["water"]
  }
};

const settlements = [
  {
    id: "gfrge",
    name: "The Fumbles",
    leader: "sohrab",
    creationTime: 1555595776947,
    objective: "Build this and that",
    score: 123,
    level: 2,
    resources: {
      tree: 123,
      lumber: 33,
      coal: 1
    },
    buildings: [
      {
        type: "quarry",
        status: "working"
      },
      {
        type: "woodcutter",
        status: "working"
      },
      {
        type: "quarry",
        status: "underConstruction"
      }
    ]
  },
  {
    id: "gngtr",
    name: "Netherland",
    leader: "Satan",
    creationTime: 1555595776000,
    objective: "Build this and that",
    score: 12,
    level: 1,
    resources: {
      tree: 123,
      goldCoin: 33,
      coal: 1
    },
    buildings: [
      {
        type: "goldMine",
        status: "working"
      },
      {
        type: "waterworks",
        status: "waiting",
        statusReason: "Need stuff"
      },
      {
        type: "goldMine",
        status: "disabled"
      }
    ]
  }
];

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

class App extends Component {
  state = {
    search: ""
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <TitleBar onSearch={value => this.setState({ search: value })} />
        <Board
          buildingTypes={buildingTypes}
          settlements={settlements}
          search={this.state.search}
        />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(App));
