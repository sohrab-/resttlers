import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const styles = {};

const about = props => {
  const { onClose } = props;
  return (
    <Dialog aria-labelledby="About" {...props}>
      <DialogTitle id="about-dialog-title">About</DialogTitle>
      <DialogContent>
        <DialogContentText id="about-dialog-description">???</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

about.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.func.isRequired,
  onClose: PropTypes.func
};

export default withStyles(styles)(about);
