import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import firebase from "firebase/app";
import "firebase/firestore"; // needed for side-effects

import TitleBar from "./TitleBar";
import Board from "./Board";

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

const Game = ({ classes }) => {
  const [search, setSearch] = useState("");
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    db.collection("settlements")
      .where("visible", "==", true)
      .onSnapshot(snapshot => {
        setSettlements(
          snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        );
      });
  }, []);

  return (
    <div className={classes.root}>
      <TitleBar
        onSearch={value => {
          setSearch(value);
        }}
      />
      <Board settlements={settlements} search={search} />
    </div>
  );
};

Game.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Game);
