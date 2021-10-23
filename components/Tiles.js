import { withStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';

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
      <ImageList cellHeight={180} className={classes.gridList} spacing={0}>
        {tiles.map(tile => (
          <ImageListItem key={tile.to} component={Link} href={tile.to}>
              {
                tile.Component
                  ? <tile.Component height="100%" className="MuiGridListTile-imgFullHeight" />
                  : <img src={tile.img} alt={tile.title} />
              }
            <ImageListItemBar className={classes.tileBar} title={tile.title} />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  )
}

export default withStyles(styles)(Tiles);
