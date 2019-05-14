import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Yellow from "@material-ui/core/colors/yellow";
import Red from "@material-ui/core/colors/red";
import Grey from "@material-ui/core/colors/grey";
import Green from "@material-ui/core/colors/green";
import Blue from "@material-ui/core/colors/blue";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { buildingTypes, resourceWildcards } from "@resttlers/engine";

import ResourceIcon from "./ResourceIcon";

const BUILDING_STATUS_DISPLAYS = {
  buildQueued: "Queued for Construction",
  underConstruction: "Under Construction",
  ready: "Ready",
  working: "Working",
  waiting: "Waiting",
  disabled: "Disabled",
  toBeDemolished: "To Be Demolished"
};

const styles = theme => ({
  text: {
    color: "#FFFFFF"
  },
  resources: {
    textAlign: "center"
  },
  working: {
    color: Green[500]
  },
  buildQueued: {
    color: Grey[500]
  },
  underConstruction: {
    color: Blue[500]
  },
  waiting: {
    color: Yellow[700]
  },
  disabled: {
    color: Red[500]
  },
  toBeDemolished: {
    color: Red[800]
  },
  statusReason: {
    color: Yellow[500]
  }
});

const BuildingTooltip = ({
  classes,
  id,
  type,
  status,
  missingResources,
  consumes,
  produces
}) => (
  <Fragment>
    <Typography variant="caption" className={classes.text} align="center">
      ID: {id}
    </Typography>
    <Typography variant="caption" className={classes.text} align="center">
      {buildingTypes[type].name}
    </Typography>
    <Typography variant="caption" className={classes[status]} align="center">
      &gt; {BUILDING_STATUS_DISPLAYS[status]} &lt;
    </Typography>
    {missingResources && missingResources.length > 0 && (
      <Typography
        variant="caption"
        className={classes.statusReason}
        align="center"
      >
        {/* TODO not "display"ing the resource */}
        {`Insufficient resources: ${missingResources.join(", ")}`}
      </Typography>
    )}
    <div className={classes.resources}>
      {Object.keys(consumes).length > 0 ? (
        Object.keys(consumes)
          .map(resource =>
            resource.startsWith("<") ? (
              resourceWildcards[resource].map(r => (
                <ResourceIcon name={r} key={r} />
              ))
            ) : (
              <ResourceIcon name={resource} key={resource} />
            )
          )
          .flat()
      ) : (
        <ResourceIcon name="nothing" key="nothing" />
      )}
      <ArrowRightIcon />
      {Object.keys(produces).map(resource => (
        <ResourceIcon name={resource} key={resource} />
      ))}
    </div>
  </Fragment>
);

BuildingTooltip.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  missingResources: PropTypes.arrayOf(PropTypes.string),
  conumes: PropTypes.object,
  produces: PropTypes.object.isRequired
};

export default withStyles(styles)(BuildingTooltip);
