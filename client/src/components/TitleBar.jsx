import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import InputBase from "@material-ui/core/InputBase";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from "@material-ui/icons/Info";
import HelpIcon from "@material-ui/icons/Help";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import About from "./About";

const styles = theme => ({
  root: {
    width: "100%",
    paddingBottom: theme.spacing.unit * 2
  },
  grow: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1,
    fontFamily: "'Condiment', cursive",
    marginTop: 15,
    display: "none",
    overflow: "visible",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  }
});

class TitleBar extends React.Component {
  state = {
    aboutDialogOpen: false
  };

  toggleAboutDialog = () => {
    this.setState(({ aboutDialogOpen }) => ({
      aboutDialogOpen: !aboutDialogOpen
    }));
  };

  render() {
    const { classes, onSearch } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h4"
              color="inherit"
              className={classes.title}
              noWrap
            >
              The Resttlers
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                onChange={event => {
                  onSearch(event.target.value);
                }}
              />
            </div>
            <div className={classes.grow} />
            <Tooltip title="API Specification" aria-label="API Specification">
              <IconButton target="_blank" href="/apidocs" color="inherit">
                <LibraryBooksIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Help" aria-label="Help">
              <IconButton
                target="_blank"
                href="https://github.com/sohrab-/resttlers/wiki/How-to-Play"
                color="inherit"
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="About" aria-label="About">
              <IconButton color="inherit" onClick={this.toggleAboutDialog}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <About
              open={this.state.aboutDialogOpen}
              onClose={this.toggleAboutDialog}
            />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

TitleBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onSearch: PropTypes.func
};

export default withStyles(styles)(TitleBar);
