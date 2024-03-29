import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import ShareIcon from "@mui/icons-material/Share";

import Link from "../src/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  navPos: {
    color: "white",
  },
}));

export default function ButtonAppBar({
  title,
  navParts,
}: {
  title: string;
  navParts?: { title: string; url: string }[];
}) {
  const classes = useStyles();
  //const router = useRouter();

  function share() {
    const data = {
      title: title + " - magick.ly",
      text:
        'Check out "' + title + '" on magick.ly, the open source magick app!',
      url: window.location.href,
    };

    //console.log({ data });

    if (navigator.share)
      navigator
        .share(data)
        .catch((error) => alert("Error sharing. " + JSON.stringify(error)));
    else alert("Sharing not supported on this platform.");
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" className={classes.navPos}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              size="large"
            >
              <HomeIcon />
            </IconButton>
          </Link>
          <Typography variant="h6" className={classes.title}>
            {navParts &&
              navParts.map((part) => (
                <span key={part.url}>
                  <Link href={part.url} className={classes.navPos}>
                    {part.title}
                  </Link>{" "}
                  &gt;{" "}
                </span>
              ))}
            {title}
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
          <IconButton
            color="inherit"
            aria-label="share"
            onClick={share}
            size="large"
          >
            <ShareIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
