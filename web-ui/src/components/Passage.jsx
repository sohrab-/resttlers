import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Fade from "@material-ui/core/Fade";
import Grey from "@material-ui/core/colors/grey";
import ReCAPTCHA from "react-google-recaptcha";

const styles = theme => ({
  root: {
    // flexGrow: 1
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
  heading: {
    marginBottom: theme.spacing.unit * 3
  },
  card: {
    padding: theme.spacing.unit * 2
  },
  read: {
    color: Grey[500]
  },
  recaptcha: {
    marginBottom: theme.spacing.unit
  },
  parchment: {
    margin: theme.spacing.unit * 2,
    backgroundColor: "#D8D84B"
  },
  footer: {
    marginTop: theme.spacing.unit * 5
  }
});

const SECTIONS = [
  {
    text: [
      "Your clan has embarked on an adventure to settle new lands.",
      "After weeks of travel, you arrive at a vast plain that reaches over the horizon."
    ]
  },
  {
    text: [
      "As you survey the land, your scouts bring back news of a curious of wall of fire that blocks the caravan's path and extends in both directions for days.",
      "As the leader of your clan, you ride ahead to inspect this new obstacle.",
      "Your scouts were certainly not exaggerating. You unmount to have closer look."
    ]
  },
  {
    text: [
      "You find the wall of fire impassable.",
      "As if to respond to your thoughts, a cracking voice calls out:",
      <em>"There is a way across."</em>
    ]
  },
  {
    text: [
      "You turn around to come face to face with an old bent figure wrapped in a heavy cloak.",
      <span>
        <em>"Speak!"</em> you command, masking your surprise at the sudden
        appearance of the old man.
      </span>,
      <span>
        <em>"There is a way"</em>, he repeats.
      </span>
    ]
  },
  {
    recaptcha: true,
    text: [
      "Then a serious expression sets in his face as he continues.",
      <em>"No robots shall pass!"</em>,
      "Slightly baffled, you reply:"
    ]
  },
  {
    parchment: true,
    text: [
      "The old man smiles a toothless grin and hands you a parchment.",
      <em>
        "This incantation will grant you passage. But you have only{" "}
        <b>two minutes</b> to make use of it."
      </em>
    ]
  },
  {
    text: [
      "You snatch the parchment out of the old man's boney fingers, mount your steed and start galloping back to your camp.",
      "You are determined. It is time to finish this passage."
    ]
  }
];
const mapSection = (
  currentIndex,
  bookmark,
  classes,
  recaptchaNode,
  parchmentNode
) => {
  const { text, recaptcha, parchment } = SECTIONS[currentIndex];

  return (
    <Fade
      in
      timeout={1000}
      className={currentIndex < bookmark ? classes.read : ""}
      key={currentIndex}
    >
      <div>
        {text.map((line, index) => (
          <Typography variant="body1" paragraph color="inherit" key={index}>
            {line}
          </Typography>
        ))}
        {recaptcha && recaptchaNode}
        {parchment && parchmentNode}
      </div>
    </Fade>
  );
};

const Passage = ({ classes }) => {
  const [bookmark, setBookmark] = useState(0);
  const [recaptchaValue, setRecaptchaValue] = useState("");

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [bookmark]);

  const handleRecaptcha = value => {
    setRecaptchaValue(value);
    setBookmark(bookmark + 1);
  };

  // const showMore = bookmark !== SECTIONS.length - 1 && !recaptcha;
  const showMore = bookmark !== SECTIONS.length - 1;

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
        </Toolbar>
      </AppBar>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item xs={10} md={8}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" className={classes.heading}>
                The Passage
              </Typography>
              {[...Array(bookmark + 1).keys()].map(i =>
                mapSection(
                  i,
                  bookmark,
                  classes,
                  <div className={classes.recaptcha}>
                    <ReCAPTCHA
                      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                      onChange={handleRecaptcha}
                    />
                  </div>,
                  <Typography
                    variant="h6"
                    align="center"
                    className={classes.parchment}
                  >
                    {recaptchaValue}
                  </Typography>
                )
              )}
              {showMore && (
                <Button
                  onClick={() => {
                    setBookmark(bookmark + 1);
                  }}
                >
                  More <ExpandMoreIcon />
                </Button>
              )}
              {bookmark === SECTIONS.length - 1 && (
                <Typography variant="overline" className={classes.footer}>
                  Go back to the instructions
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

Passage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Passage);
