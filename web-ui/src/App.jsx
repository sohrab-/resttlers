import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./utils/withRoot";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Game from "./components/Game";
import Passage from "./components/Passage";

const styles = {};

const App = () => {
  return (
    <Router>
      <Route exact path="/" component={Game} />
      <Route exact path="/passage" component={Passage} />
    </Router>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(App));
