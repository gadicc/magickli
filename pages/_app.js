import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "../src/theme";
import db from "../src/db";
import workboxStuff from "../src/workboxStuff";
import "../src/global.css";
import { ConfirmDialog } from "../src/asyncConfirm";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  React.useEffect(() => {
    workboxStuff();
  });

  return (
    <React.Fragment>
      <Head>
        <title key="title">Magick.ly</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <SessionProvider session={session}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
            <ConfirmDialog />
          </SessionProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
