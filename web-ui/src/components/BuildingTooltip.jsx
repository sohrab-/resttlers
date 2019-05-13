import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
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
  disabled: "Disabled"
};

const styles = theme => ({
  text: {
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
  statusReason: {
    color: Yellow[500]
  }
});

const BuildingTooltip = ({
  classes,
  type,
  status,
  missingResources,
  consumes,
  produces
}) => (
  <Fragment>
    <div className={classes.text}>
      <b>{buildingTypes[type].name}</b>
      <br />
      <span className={classes[status]}>
        ({BUILDING_STATUS_DISPLAYS[status]})
      </span>
      {missingResources && missingResources.length > 0 && (
        <span className={classes.statusReason}>
          <br />
          {/* TODO not "display"ing the resource */}
          {`Insufficient resources: ${missingResources.join(", ")}`}
        </span>
      )}
      <br />
      <br />
      {consumes &&
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
          .flat()}
      <ArrowRightIcon />
      {Object.keys(produces).map(resource => (
        <ResourceIcon name={resource} key={resource} />
      ))}
    </div>
  </Fragment>
);

BuildingTooltip.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  missingResources: PropTypes.arrayOf(PropTypes.string),
  conumes: PropTypes.object,
  produces: PropTypes.object.isRequired
};

export default withStyles(styles)(BuildingTooltip);
