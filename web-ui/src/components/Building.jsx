import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Grow from "@material-ui/core/Grow";

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

const Building = ({
  classes,
  type,
  status,
  missingResources,
  consumes,
  produces
}) => (
  <Grow in timeout={500}>
    <Tooltip
      title={
        <BuildingTooltip
          type={type}
          status={status}
          missingResources={missingResources}
          consumes={consumes}
          produces={produces}
        />
      }
    >
      <BuildingIcon type={type} status={status} />
    </Tooltip>
  </Grow>
);

Building.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  missingResources: PropTypes.arrayOf(PropTypes.string),
  conumes: PropTypes.object,
  produces: PropTypes.object.isRequired
};

export default withStyles(styles)(Building);
