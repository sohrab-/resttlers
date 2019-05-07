import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/firestore";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./utils/withRoot";
import TitleBar from "./components/TitleBar";
import Board from "./components/Board";

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

// Initialise Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
});

const db = firebase.firestore();

class App extends Component {
  state = {
    search: "",
    buildingTypes: {},
    settlements: []
  };

  componentDidMount() {
    db.collection("settlements")
      .where("status", "==", "verified")
      .onSnapshot(snapshot => {
        this.setState({
          settlements: snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        });
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
