import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Settlement from "./Settlement";

const SORT_OPTIONS = {
  score: "Sort by highest score",
  creationTime: "Sort by created first"
};

const filterSettlement = search => settlement =>
  settlement.id.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
  settlement.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
  settlement.leader.toLowerCase().indexOf(search.toLowerCase()) > -1;

const styles = theme => ({
  sortSelect: {
    marginTop: 0,
    marginLeft: "auto",
    marginRight: theme.spacing.unit * 2,
    float: "right"
  },
  sortSelectText: {
    fontSize: "small"
  },
  empty: {
    textAlign: "center"
  },
  emptyText: {
    color: " #b3b3b3"
  }
});

class Board extends Component {
  state = {
    sort: "creationTime",
    pinned: ""
  };

  sortSettlements = (a, b) =>
    a.id === this.state.pinned
      ? -1
      : b.id === this.state.pinned
      ? 1
      : this.state.sort === "creationTime"
      ? a.creationTime > b.creationTime
        ? 1
        : -1
      : a.score < b.score
      ? 1
      : -1;

  render() {
    const { classes, search, buildingTypes, settlements } = this.props;

    return (
      <div>
        <Select
          className={classes.sortSelect}
          value={this.state.sort}
          onChange={event => {
            this.setState({ sort: event.target.value });
          }}
          classes={{
            root: classes.sortSelectText
          }}
          disableUnderline
        >
          {Object.entries(SORT_OPTIONS).map(([key, value]) => (
            <MenuItem
              key={key}
              value={key}
              classes={{ root: classes.sortSelectText }}
            >
              {value}
            </MenuItem>
          ))}
          >
        </Select>
        <Grid container spacing={24}>
          {settlements.length > 0 ? (
            settlements
              .filter(filterSettlement(search))
              .slice()
              .sort(this.sortSettlements)
              .map(settlement => {
                const { id, ...others } = settlement;
                return (
                  <Grid item xs={12} md={6} lg={4} key={id}>
                    <Settlement
                      settlementId={id}
                      {...others}
                      buildingTypes={buildingTypes}
                      pinned={id === this.state.pinned}
                      onPin={id => {
                        this.setState({ pinned: id });
                      }}
                    />
                  </Grid>
                );
              })
          ) : (
            <Grid item xs={12} className={classes.empty}>
              <Typography variant="h6" className={classes.emptyText}>
                No settlements yet!
              </Typography>
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

Board.propTypes = {
  classes: PropTypes.object.isRequired,
  search: PropTypes.string,
  buildingTypes: PropTypes.object.isRequired,
  settlements: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withStyles(styles)(Board);
