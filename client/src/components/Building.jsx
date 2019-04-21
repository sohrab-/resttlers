import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import Yellow from "@material-ui/core/colors/yellow";
import Red from "@material-ui/core/colors/red";
import Grey from "@material-ui/core/colors/grey";
import Green from "@material-ui/core/colors/green";
import Blue from "@material-ui/core/colors/blue";
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
  buildQueued: "Queued for Construction",
  underConstruction: "Under Construction",
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
  goldMine: 13
};

export const sortBuilding = (a, b) => BUILDING_ORDER[a] - BUILDING_ORDER[b];

const styles = theme => ({
  "@keyframes blink": {
    "0%": {
      opacity: 1
    },
    "50%": {
      opacity: 0.4
    },
    "100%": {
      opacity: 1
    }
  },
  tooltipText: {
    textAlign: "center"
  },
  workingTooltip: {
    color: Green[500]
  },
  buildQueuedImage: {
    opacity: 0.4
  },
  buildQueuedTooltip: {
    color: Grey[500]
  },
  underConstructionImage: {
    animation: "blink normal 2s infinite ease-in-out"
  },
  underConstructionTooltip: {
    color: Blue[500]
  },
  waitingImage: {
    filter: "drop-shadow(0 0 10px darkorange)"
  },
  waitingTooltip: {
    color: Yellow[700]
  },
  disabledImage: {
    filter: "drop-shadow(0 0 10px red)"
  },
  disabledTooltip: {
    color: Red[500]
  },
  statusReasonTooltip: {
    color: Yellow[500]
  }
});

const component = props => {
  const { classes, type, status, statusReason, consumes, produces } = props;
  return (
    <Tooltip
      title={
        <React.Fragment>
          <div className={classes.tooltipText}>
            <b>{BUILDING_DISPLAYS[type]}</b>
            <br />
            <span className={classes[`${status}Tooltip`]}>
              ({BUILDING_STATUS_DISPLAYS[status]})
            </span>
            {statusReason && (
              <span className={classes.statusReasonTooltip}>
                <br />
                {statusReason}
              </span>
            )}
            <br />
            <br />
            {consumes &&
              consumes.map(resource => <ResourceIcon name={resource} />)}
            <ArrowRightIcon />
            {produces.map(resource => (
              <ResourceIcon name={resource} />
            ))}
          </div>
        </React.Fragment>
      }
    >
      <img
        src={BUILDING_IMAGES[type]}
        className={classes[`${status}Image`] || {}}
      />
    </Tooltip>
  );
};

component.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  statusReason: PropTypes.string.isRequired,
  conumes: PropTypes.arrayOf(PropTypes.string).isRequired,
  produces: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default withStyles(styles)(component);
