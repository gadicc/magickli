import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import Link from '../src/Link';

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
    //height: 450,
  },
  tileBar: {
    background: 'rgba(0, 0, 0, 0.6)',
  }
});

function Tiles({ tiles, classes }) {
  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList} spacing={0}>
        {tiles.map(tile => (
          <GridListTile key={tile.to} component={Link} href={tile.to}>
              {
                tile.Component
                  ? <tile.Component height="100%" className="MuiGridListTile-imgFullHeight" />
                  : <img src={tile.img} alt={tile.title} />
              }
            <GridListTileBar className={classes.tileBar} title={tile.title} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}

export default withStyles(styles)(Tiles);
