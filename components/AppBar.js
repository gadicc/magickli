import React from 'react';
// import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import ShareIcon from '@material-ui/icons/Share';

import Link from '../src/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  navPos: {
    color: 'white'
  }
}));

export default function ButtonAppBar({ title, navParts }) {
  const classes = useStyles();
  //const router = useRouter();

  function share() {
    const data = {
      title: title + ' - magick.li',
      text: 'Check out "' + title + '" on magick.li, the open source magick app!',
      url: window.location,
    };

    //console.log({ data });

    if (navigator.share)
      navigator.share(data)
        .catch(e => alert("Error sharing. " + JSON.stringify(error)));
    else
      alert("Sharing not supported on this platform.");
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" className={classes.navPos}>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <HomeIcon />
            </IconButton>
          </Link>
          <Typography variant="h6" className={classes.title}>
            {
              navParts && navParts.map(part => (
                <span key={part.url}>
                  <Link href={part.url} className={classes.navPos}>
                    {part.title}
                  </Link>
                  {" "}&gt;{" "}
                </span>
              ))
            }
            {title}
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
          <IconButton color="inherit" aria-label="share" onClick={share}>
            <ShareIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
