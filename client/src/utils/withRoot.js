import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Brown from "@material-ui/core/colors/brown";
import CssBaseline from "@material-ui/core/CssBaseline";

// A theme with custom primary and secondary color.
const theme = createMuiTheme({
  palette: {
    primary: Brown,
    secondary: Brown
  },
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        backgroundColor: "#000000"
      }
    }
  }
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
