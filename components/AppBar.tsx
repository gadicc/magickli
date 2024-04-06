import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import ShareIcon from "@mui/icons-material/Share";
import { useGongoOne, useGongoUserId } from "gongo-client-react";
import { signIn, signOut } from "next-auth/react";

import Link from "../src/Link";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Login } from "@mui/icons-material";
import db, { enableNetwork } from "../src/db";

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

  const userId = useGongoUserId();
  const user = useGongoOne((db) =>
    db.collection("users").find({ _id: userId })
  );
  const avatarSrc = user?.image || user?.photos?.[0]?.value;
  const network = useGongoOne((db) => db.gongoStore.find({ _id: "network" }));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserClose = () => {
    setAnchorEl(null);
  };

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
          {userId ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenu}
                color="inherit"
              >
                {avatarSrc ? (
                  <Avatar
                    alt={
                      typeof user?.displayName === "string"
                        ? user.displayName
                        : "avatar"
                    }
                    src={avatarSrc}
                    imgProps={{ referrerPolicy: "no-referrer" }}
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleUserClose}
              >
                <MenuItem
                  onClick={() => {
                    signOut();
                    handleUserClose();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              variant="text"
              sx={{ color: "white" }}
              onClick={() => {
                if (!network) enableNetwork();
                signIn();
              }}
            >
              <Login />
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
