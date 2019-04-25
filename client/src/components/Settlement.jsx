import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Badge from "@material-ui/core/Badge";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import FlagIcon from "@material-ui/icons/FlagOutlined";
import StarIcon from "@material-ui/icons/Star";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";

import Resource, { sortResources } from "./Resource";
import Building, { sortBuilding } from "./Building";

import HeadquartersImage from "../images/headquarters.png";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    color: theme.palette.text.secondary
  },
  cardContent: {
    padding: 0
  },
  levelBadge: {
    top: "20%",
    right: 5
  },
  section: {
    margin: theme.spacing.unit * 2,
    textAlign: "center"
  },
  objective: {
    textAlign: "center",
    marginTop: theme.spacing.unit
  }
});

const settlement = props => {
  const {
    classes,
    settlementId,
    name,
    leader,
    objective,
    score,
    level,
    resources,
    buildings,
    buildingTypes,
    pinned,
    onPin
  } = props;
  return (
    <Card>
      <CardHeader
        avatar={
          <Tooltip
            title={`ID: ${settlementId}`}
            aria-label={`ID: ${settlementId}`}
          >
            <Badge
              badgeContent={level}
              color="primary"
              classes={{ badge: classes.levelBadge }}
            >
              <img src={HeadquartersImage} />
            </Badge>
          </Tooltip>
        }
        title={name}
        subheader={`Leader: ${leader}`}
        action={
          <Tooltip title="Pin to the top" aria-label="Pin to the top">
            <IconButton onClick={() => onPin(pinned ? "" : settlementId)}>
              {pinned ? <LockIcon /> : <LockOpenIcon />}
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent className={classes.cardContent}>
        <div className={classes.objective}>
          <Tooltip title="Score" aria-label="Score" placement="left">
            <Chip label={score} icon={<StarIcon />} color="secondary" />
          </Tooltip>
          <Tooltip title="Objective" aria-label="Objective" placement="right">
            <Chip
              label={objective}
              icon={<FlagIcon />}
              color="secondary"
              variant="outlined"
            />
          </Tooltip>
        </div>
        <div className={classes.section}>
          {Object.entries(resources)
            .sort((a, b) => sortResources(a[0], b[0]))
            .map(([name, amount]) => (
              <Resource name={name} amount={amount} />
            ))}
        </div>
        <Divider />
        <div className={classes.section}>
          {buildings
            .sort((a, b) => 10 * sortBuilding(a.type, b.type))
            .map(building => (
              <Building
                {...building}
                consumes={buildingTypes[building.type].consumes}
                produces={buildingTypes[building.type].produces}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

settlement.propTypes = {
  classes: PropTypes.object.isRequired,
  settlementId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  leader: PropTypes.string.isRequired,
  objective: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  resources: PropTypes.object.isRequired,
  buildings: PropTypes.arrayOf(PropTypes.object).isRequired,
  buildingTypes: PropTypes.object.isRequired,
  pinned: PropTypes.bool.isRequired,
  onPin: PropTypes.func
};

export default withStyles(styles)(settlement);
