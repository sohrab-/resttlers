import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ResourceImage from "../images/resources.png";
import TransparentImage from "../images/transparent.gif";

const BACKGROUND_OFFSET = {
  stoneDeposit: [8, 6],
  stone: [2, 0],
  tree: [4, 6],
  lumber: [0, 0],
  plank: [10, 1],
  water: [2, 1],
  grain: [3, 1],
  flour: [5, 1],
  bread: [6, 1],
  fish: [3, 0],
  meat: [6, 2],
  coal: [10, 0],
  goldOre: [2, 2],
  goldBar: [3, 2],
  goldCoin: [4, 2]
};

const styles = {
  root: {
    width: "24px",
    height: "24px",
    background: `url(${ResourceImage})`
  }
};

const backgroundPosition = resource => {
  const [x, y] = BACKGROUND_OFFSET[resource] || [11, 11]; // default to question mark
  return `${x * -24}px ${y * -24}px`; // each tile is 24x24
};

const ResourceIcon = ({ classes, name }) => (
  <img
    src={TransparentImage}
    className={classes.root}
    style={{ backgroundPosition: backgroundPosition(name) }}
    alt={name}
  />
);

ResourceIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired
};

export default withStyles(styles)(ResourceIcon);
