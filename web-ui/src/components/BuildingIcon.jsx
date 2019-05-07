import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { usePrevious } from "../utils/hooks";
import buildingImages from "../images/buildingImages";
import animate from "../utils/animate";

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
  buildQueued: {
    opacity: 0.4
  },
  underConstruction: {
    animation: "blink normal 2s infinite ease-in-out"
  },
  waiting: {
    filter: "drop-shadow(0 0 10px darkorange)"
  },
  disabled: {
    filter: "drop-shadow(0 0 10px red)"
  }
});

const BuildingIcon = ({ classes, type, status, ...theRest }) => {
  const previousStatus = usePrevious(status);
  const imageDom = useRef();
  useEffect(() => {
    if (previousStatus === "underConstruction") {
      animate(imageDom.current, "rubberBand");
    }
  }, [status]);

  return (
    <img
      {...theRest} // for tooltips to attach event handlers
      ref={imageDom}
      src={buildingImages[type]}
      alt={type}
      className={classes[status]}
    />
  );
};

BuildingIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};

export default withStyles(styles)(BuildingIcon);
