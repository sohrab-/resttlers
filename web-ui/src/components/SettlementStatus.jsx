import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import FlagIcon from "@material-ui/icons/FlagOutlined";
import StarIcon from "@material-ui/icons/Star";

const styles = {};

class SettlementStatus extends Component {
  render() {
    const { objective, score } = this.props;
    return (
      <Fragment>
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
      </Fragment>
    );
  }
}

SettlementStatus.propTypes = {
  classes: PropTypes.object.isRequired,
  objective: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired
};

export default withStyles(styles)(SettlementStatus);
