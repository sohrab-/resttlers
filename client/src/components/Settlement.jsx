import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import FlagIcon from "@material-ui/icons/FlagOutlined";
import Resource from "./Resource";
import Building from "./Building";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  section: {
    margin: theme.spacing.unit * 2
  },
  objectiveIcon: {
    verticalAlign: "bottom !important"
  }
});

const component = props => {
  const {
    classes,
    settlementId = "shgy",
    name = "The Fumbles",
    leader = "Sohrab",
    objective = "Build a Farm, a Mill and a Bakery"
  } = props;
  return (
    <Paper className={classes.root}>
      <div className={classes.section}>
        <Tooltip
          title={`ID: ${settlementId}`}
          aria-label={`ID: ${settlementId}`}
          placement="top"
        >
          <Typography variant="h6">{name}</Typography>
        </Tooltip>
        <Typography variant="subtitle2">Leader: {leader}</Typography>
      </div>
      <Divider />
      <Typography className={classes.section}>
        <Tooltip title="Objective" aria-label="Objective" placement="left">
          <FlagIcon className={classes.objectiveIcon} />
        </Tooltip>{" "}
        {objective}
      </Typography>
      <Divider />
      <div className={classes.section}>
        <Resource name="stone" amount={3} />
        <Resource name="goldCoin" amount={53} />
      </div>
      <Divider />
      <div className={classes.section}>
        <Building
          name="quarry"
          status="working"
          consumes={["stoneDeposit"]}
          produces={["stone"]}
        />
        <Building
          name="goldSmelting"
          status="disabled"
          statusReason="Stuff I need is not here"
          consumes={["goldOre", "coal"]}
          produces={["goldBar"]}
        />
      </div>
    </Paper>
  );
};

component.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(component);
