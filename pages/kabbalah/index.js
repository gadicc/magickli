import React from 'react';
import Link from '../../src/Link';
//import Link from '@material-ui/core/Link';

import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import AppBar from '../../components/AppBar';

const tileData = [
  {
    img: '/pics/treeOfLife.jpg',
    title: 'Sephirot',
    to: '/kabbalah/sephirot'
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
      <AppBar title="Kabbalah" />

      <div className={classes.root}>
        <GridList cellHeight={180} className={classes.gridList} spacing={0}>
          {tileData.map(tile => (
            <GridListTile key={tile.img} component={Link} href={tile.to}>
              <img src={tile.img} alt={tile.title} />
              <GridListTileBar className={classes.tileBar} title={tile.title} />
            </GridListTile>
          ))}
        </GridList>
      </div>
    </>
  );
}

export default withStyles(styles)(Index);
