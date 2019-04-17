import React, { Component } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./utils/withRoot";
import TitleBar from "./components/TitleBar";
import Settlement from "./components/Settlement";

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

class App extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <TitleBar />
        <Grid container spacing={24}>
          <Grid item xs={12} md={6} lg={4}>
            <Settlement />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Settlement />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Settlement />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Settlement />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Settlement />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Settlement />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Settlement />
          </Grid>
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(App));
