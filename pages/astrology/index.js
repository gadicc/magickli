import React from 'react';
import Link from '../../src/Link';
//import Link from '@material-ui/core/Link';

import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import AppBar from '../../components/AppBar';
import MoonWidget from '../../components/astrology/Moon';

const tileData = [
  {
    img: '/pics/planets2013.jpg',
    title: 'Planets',
    to: '/astrology/planets'
  },
  {
    img: '/pics/astrology.jpg',
    title: 'Zodiac',
    to: '/astrology/zodiac'
  },
  {
    Component: MoonWidget,
    title: 'Moon',
    to: '/astrology/moon'
  },
];

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  tileBar: {
    background: 'rgba(0, 0, 0, 0.6)',
  }
});


function Index({ classes }) {
  return (
    <>
      <AppBar title="Astrology" />

      <div className={classes.root}>
        <GridList cellHeight={180} className={classes.gridList} spacing={0}>
          {tileData.map(tile => (
            <GridListTile key={tile.to} component={Link} href={tile.to}>
              {
                tile.img
                ? <img src={tile.img} alt={tile.title} />
                : <tile.Component />
              }
              <GridListTileBar className={classes.tileBar} title={tile.title} />
            </GridListTile>
          ))}
        </GridList>
      </div>
    </>
  );
}

export default withStyles(styles)(Index);
