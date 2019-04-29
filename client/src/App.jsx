import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./utils/withRoot";
import TitleBar from "./components/TitleBar";
import Board from "./components/Board";

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

class App extends Component {
  state = {
    search: "",
    buildingTypes: {},
    settlements: []
  };

  componentDidMount() {
    const host = process.env.REACT_APP_LOCATION_HOST || window.location.host;
    const socket = new WebSocket(`ws://${host}`);
    socket.addEventListener("message", event => {
      const json = JSON.parse(event.data);
      this.setState(json);
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <TitleBar onSearch={value => this.setState({ search: value })} />
        <Board
          buildingTypes={this.state.buildingTypes}
          settlements={this.state.settlements}
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
