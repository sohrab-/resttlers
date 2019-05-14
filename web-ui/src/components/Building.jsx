import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

import { buildingTypes } from "@resttlers/engine";

import BuildingIcon from "./BuildingIcon";
import BuildingTooltip from "./BuildingTooltip";

const BUILDING_ORDER = {
  quarry: 0,
  woodcutter: 1,
  forester: 2,
  sawmill: 3,
  waterworks: 4,
  farm: 5,
  mill: 6,
  bakery: 7,
  fishery: 8,
  hunter: 9,
  coalMine: 10,
  goldMine: 11,
  goldSmelting: 12,
  goldMint: 13
};

export const sortBuilding = (a, b) => BUILDING_ORDER[a] - BUILDING_ORDER[b];

const styles = theme => ({});

const Building = ({ classes, id, type, status, missingResources }) => (
  <Tooltip
    interactive
    title={
      <BuildingTooltip
        id={id}
        type={type}
        status={status}
        missingResources={missingResources}
        consumes={buildingTypes[type].consumes}
        produces={buildingTypes[type].produces}
      />
    }
  >
    <BuildingIcon type={type} status={status} />
  </Tooltip>
);

Building.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  missingResources: PropTypes.arrayOf(PropTypes.string)
};

export default withStyles(styles)(Building);
