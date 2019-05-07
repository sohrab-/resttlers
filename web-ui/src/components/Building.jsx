import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Grow from "@material-ui/core/Grow";
import Yellow from "@material-ui/core/colors/yellow";
import Red from "@material-ui/core/colors/red";
import Grey from "@material-ui/core/colors/grey";
import Green from "@material-ui/core/colors/green";
import Blue from "@material-ui/core/colors/blue";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import { buildingTypes } from "@resttlers/engine";

import { usePrevious } from "../utils/hooks";
import ResourceIcon from "./ResourceIcon";
import buildingImages from "../images/buildingImages";

const BUILDING_STATUS_DISPLAYS = {
  buildQueued: "Queued for Construction",
  underConstruction: "Under Construction",
  ready: "Ready",
  working: "Working",
  waiting: "Waiting",
  disabled: "Disabled"
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
  goldMint: 13
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

const Building = ({
  classes,
  type,
  status,
  missingResources,
  consumes,
  produces
}) => {
  const previousStatus = usePrevious(status);
  const imageDom = useRef();
  useEffect(() => {
    if (previousStatus === "underConstruction") {
      imageDom.current.classList.add("animated", "rubberBand");
      function handleAnimationEnd() {
        imageDom.current.classList.remove("animated", "rubberBand");
        imageDom.current.removeEventListener(
          "animationend",
          handleAnimationEnd
        );
      }
      imageDom.current.addEventListener("animationend", handleAnimationEnd);
    }
  }, [status]);

  return (
    <Grow in timeout={500}>
      <Tooltip
        title={
          <React.Fragment>
            <div className={classes.tooltipText}>
              <b>{buildingTypes[type].name}</b>
              <br />
              <span className={classes[`${status}Tooltip`]}>
                ({BUILDING_STATUS_DISPLAYS[status]})
              </span>
              {missingResources.length > 0 && (
                <span className={classes.statusReasonTooltip}>
                  <br />
                  {/* TODO not "display"ing the resource */}
                  {`Insufficient resources: ${missingResources.join(", ")}`}
                </span>
              )}
              <br />
              <br />
              {consumes &&
                Object.keys(consumes).map(resource => (
                  <ResourceIcon name={resource} key={resource} />
                ))}
              <ArrowRightIcon />
              {Object.keys(produces).map(resource => (
                <ResourceIcon name={resource} key={resource} />
              ))}
            </div>
          </React.Fragment>
        }
      >
        <img
          ref={imageDom}
          src={buildingImages[type]}
          alt={type}
          className={classes[`${status}Image`]}
        />
      </Tooltip>
    </Grow>
  );
};

Building.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  missingResources: PropTypes.arrayOf(PropTypes.string),
  conumes: PropTypes.object,
  produces: PropTypes.object.isRequired
};

export default withStyles(styles)(Building);
