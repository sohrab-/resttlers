import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";

import { levels } from "@resttlers/engine";

import Resource, { sortResources } from "./Resource";
import Building, { sortBuilding } from "./Building";

import HeadquartersImage from "../images/headquarters.png";
import SettlementStatus from "./SettlementStatus";

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
  },
  emptyText: {
    color: " #b3b3b3"
  }
});

const Settlement = ({
  classes,
  settlementId,
  name,
  leader,
  score,
  level,
  resources,
  buildings,
  buildQueue,
  pinned,
  onPin
}) => {
  const allBuildings = Object.values(buildings)
    .concat(buildQueue.map(item => item.building))
    .sort((a, b) => 10 * sortBuilding(a.type, b.type)); // TODO sort in each building by status: working/waiting/disabled -> underConstruction -> buildQueued

  return (
    <Card>
      <CardHeader
        avatar={
          <Tooltip
            title={`ID: ${settlementId}`}
            aria-label={`ID: ${settlementId}`}
            interactive
          >
            <Badge
              badgeContent={level}
              color="primary"
              classes={{ badge: classes.levelBadge }}
            >
              <img src={HeadquartersImage} alt="headquarters" />
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
          <SettlementStatus score={score} objective={levels[level].objective} />
        </div>
        <div className={classes.section}>
          {Object.entries(resources)
            .sort((a, b) => sortResources(a[0], b[0]))
            .map(([name, amount]) => (
              <Resource name={name} amount={amount} key={name} />
            ))}
        </div>
        <Divider />
        <div className={classes.section}>
          {allBuildings.length > 0 ? (
            allBuildings.map((building, index) => (
              <Building {...building} key={`building-${index}`} />
            ))
          ) : (
            <Typography className={classes.emptyText}>
              No buildings yet!
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

Settlement.propTypes = {
  classes: PropTypes.object.isRequired,
  settlementId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  leader: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  resources: PropTypes.object.isRequired,
  buildings: PropTypes.object.isRequired,
  buildQueue: PropTypes.arrayOf(PropTypes.object).isRequired,
  pinned: PropTypes.bool.isRequired,
  onPin: PropTypes.func
};

export default withStyles(styles)(Settlement);
