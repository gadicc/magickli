"use client";
import React from "react";
import { useGongoOne, useGongoUserId } from "gongo-client-react";
import { signIn, signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  AppBar,
  Avatar,
  Button,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import { AccountCircle, Login, Home, Share } from "@mui/icons-material";

// import Link from "@/lib/link";
import db, { enableNetwork } from "@/db";
import pathnames, { PathnameValue } from "./pathnames";
import NextLink from "next/link";
// import { SITE_TITLE } from "@/api-lib/consts";
const SITE_TITLE = "Magick.ly";

function usePathnameInfo() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navParts: { title: string; url: string }[] = [];
  if (!pathname) return { title: SITE_TITLE, navParts };
  // if (pathnames[pathname]) return { title: pathnames[pathname], navParts };

  let navPath = "";

  let value: typeof pathnames | PathnameValue | string = pathnames;
  const parts = pathname.split("/").filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    value = value[part];
    if (typeof value === "string") break;
    if (i === parts.length - 1) break;
    navPath += "/" + part;
    navParts.push({ url: navPath, title: value["/"] as string });
  }

  if (typeof value === "function")
    value = value({ pathname, searchParams }) as string;
  else if (typeof value === "object") value = value["/"];

  return { navParts, title: value as unknown as string };
}

export default function ButtonAppBar() {
  const { title, navParts } = usePathnameInfo();
  console.log(navParts);

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
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            href="/"
          >
            <Home />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {navParts &&
              navParts.map((part) => (
                <span key={part.url}>
                  <NextLink
                    href={part.url}
                    style={{ color: "inherit" /*, textDecoration: "none" */ }}
                  >
                    {part.title}
                  </NextLink>{" "}
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
            <Share />
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
