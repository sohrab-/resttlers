import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grow from "@material-ui/core/Grow";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import ResourceIcon from "./ResourceIcon";

// TODO move to common/resources?
const RESOURCE_DISPLAYS = {
  stoneDeposit: "Stone Deposit",
  stone: "Stone",
  tree: "Tree",
  lumber: "Lumber",
  plank: "Plank",
  water: "Water",
  grain: "Grain",
  flour: "Flour",
  bread: "Bread",
  fish: "Fish",
  meat: "Meat",
  coal: "Coal",
  goldOre: "Gold Ore",
  goldBar: "Gold Bar",
  goldCoin: "Gold Coin"
};

// TODO start with an array and compile this thing at start-up
const RESOURCE_ORDER = {
  stoneDeposit: 0,
  stone: 1,
  tree: 2,
  lumber: 3,
  plank: 4,
  water: 5,
  grain: 6,
  flour: 7,
  bread: 8,
  fish: 9,
  meat: 10,
  coal: 11,
  goldOre: 12,
  goldBar: 13,
  goldCoin: 14
};

export const sortResources = (a, b) => RESOURCE_ORDER[a] - RESOURCE_ORDER[b];

const styles = theme => ({
  chip: {
    justifyContent: "center",
    margin: theme.spacing.unit,
    paddingLeft: theme.spacing.unit // give the icon some room
  }
});

const Resource = ({ classes, name, amount }) => {
  const resourceName = RESOURCE_DISPLAYS[name];
  // TODO if empty resource, background light red
  return (
    <Grow in timeout={500}>
      <Tooltip title={resourceName} aria-label={resourceName}>
        <Chip
          className={classes.chip}
          label={amount}
          icon={<ResourceIcon name={name} />}
          variant="outlined"
        />
      </Tooltip>
    </Grow>
  );
};

Resource.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired
};

export default withStyles(styles)(Resource);
