import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import Yellow from "@material-ui/core/colors/yellow";
import Red from "@material-ui/core/colors/red";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import ResourceIcon from "./ResourceIcon";

import QuarryImage from "../images/quarry.png";
import WoodcutterImage from "../images/woodcutter.png";
import ForesterImage from "../images/forester.png";
import SawmillImage from "../images/sawmill.png";
import WaterworksImage from "../images/waterworks.png";
import FarmImage from "../images/farm.png";
import MillImage from "../images/mill.png";
import BakeryImage from "../images/bakery.png";
import FisheryImage from "../images/fishery.png";
import HunterImage from "../images/hunter.png";
import CoalMineImage from "../images/coalMine.png";
import GoldMineImage from "../images/goldMine.png";
import GoldSmeltingImage from "../images/goldSmelting.png";
import GoldMintImage from "../images/goldMint.png";

const BUILDING_DISPLAYS = {
  quarry: "Quarry",
  woodcutter: "Woodcutter",
  forester: "Forester",
  sawmill: "Sawmill",
  waterworks: "Waterworks",
  farm: "Farm",
  mill: "Mill",
  bakery: "Bakery",
  fishery: "Fishery",
  hunter: "Hunter",
  coalMine: "Coal Mine",
  goldMine: "Gold Mine",
  goldSmelting: "Gold Smelting",
  goldMint: "Gold Mint"
};

const BUILDING_STATUS_DISPLAYS = {
  ready: "Ready",
  working: "Working",
  waiting: "Waiting",
  disabled: "Disabled"
};

const BUILDING_IMAGES = {
  quarry: QuarryImage,
  woodcutter: WoodcutterImage,
  forester: ForesterImage,
  sawmill: SawmillImage,
  waterworks: WaterworksImage,
  farm: FarmImage,
  mill: MillImage,
  bakery: BakeryImage,
  fishery: FisheryImage,
  hunter: HunterImage,
  coalMine: CoalMineImage,
  goldMine: GoldMineImage,
  goldSmelting: GoldSmeltingImage,
  goldMint: GoldMintImage
};

const styles = theme => ({
  tooltipText: {
    textAlign: "center"
  },
  badgeWaiting: {
    background: Yellow[500]
  },
  badgeDisabled: {
    right: 10,
    width: 10,
    height: 10,
    background: Red[500]
  },
  statusReasonTooltip: {
    color: Yellow[500]
  }
});

const component = props => {
  const { classes, name, status, statusReason, consumes, produces } = props;
  return (
    <Tooltip
      title={
        <React.Fragment>
          <div className={classes.tooltipText}>
            <b>{BUILDING_DISPLAYS[name]}</b>
            <br />({BUILDING_STATUS_DISPLAYS[status]})
            {statusReason && (
              <span className={classes.statusReasonTooltip}>
                <br />
                {statusReason}
              </span>
            )}
            <br />
            <br />
            {consumes.map(resource => (
              <ResourceIcon name={resource} />
            ))}
            <ArrowRightIcon />
            {produces.map(resource => (
              <ResourceIcon name={resource} />
            ))}
          </div>
        </React.Fragment>
      }
    >
      <Badge
        variant="dot"
        classes={{
          badge:
            status === "disabled"
              ? classes.badgeDisabled
              : status === "waiting"
              ? classes.badgeWaiting
              : {}
        }}
      >
        <img src={BUILDING_IMAGES[name]} />
      </Badge>
    </Tooltip>
  );
};

component.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  statusReason: PropTypes.string.isRequired,
  conumes: PropTypes.arrayOf(PropTypes.string).isRequired,
  produces: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default withStyles(styles)(component);
