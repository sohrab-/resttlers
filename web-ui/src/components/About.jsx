import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import GithubIcon from "../icons/Github";
import TwitterIcon from "../icons/Twitter";

const styles = theme => ({
  title: {
    fontFamily: "'Condiment', cursive",
    marginTop: theme.spacing.unit * 2
  },
  content: {
    textAlign: "center"
  },
  sponsor: {
    marginTop: theme.spacing.unit * 4
  }
});

const About = ({ onClose, open, classes }) => {
  return (
    <Dialog aria-labelledby="About" open={open} className={classes.content}>
      <DialogContent>
        <Typography variant="h4" className={classes.title}>
          The Resttlers
        </Typography>
        <Typography variant="overline">Developed by Sohrab</Typography>
        <Tooltip title="GitHub" aria-label="GitHub">
          <IconButton
            target="_blank"
            href="https://github.com/sohrab-"
            color="inherit"
          >
            <GithubIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Twitter" aria-label="Twitter">
          <IconButton
            target="_blank"
            href="https://twitter.com/sohrabwashere"
            color="inherit"
          >
            <TwitterIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="body2">
          Design heavily inspired by{" "}
          <Link
            target="_blank"
            href="https://en.wikipedia.org/wiki/The_Settlers"
          >
            The Settlers
          </Link>{" "}
          game series
        </Typography>
        <Typography>
          Game art assets from{" "}
          <Link target="_blank" href="https://thesettlersonline.fandom.com">
            The Settlers Online Wiki
          </Link>
        </Typography>
        <Typography className={classes.sponsor}>
          Sponsored by{" "}
          <Link target="_blank" href="https://platform.deloitte.com.au">
            Deloitte Platform Engineering
          </Link>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

About.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func
};

export default withStyles(styles)(About);
