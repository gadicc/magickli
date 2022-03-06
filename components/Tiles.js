// import Image from "next/image";

import withStyles from "@mui/styles/withStyles";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import Link from "../src/Link";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    //height: 450,
  },
  tileBar: {
    background: "rgba(0, 0, 0, 0.6)",
  },
  img: {
    overflow: "hidden",
  },
});

function Tiles({ tiles, classes }) {
  return (
    <div>
      <ImageList rowHeight={180} gap={0} sx={{ width: "100%", margin: 0 }}>
        {tiles.map((tile) => (
          <ImageListItem key={tile.to} component={Link} href={tile.to}>
            {tile.Component ? (
              <tile.Component
                height="100%"
                className="MuiGridListTile-imgFullHeight"
              />
            ) : (
              <img
                className={classes.img} // eslint-disable-line
                src={tile.img}
                alt={tile.title}
              />
            )}
            <ImageListItemBar className={classes.tileBar} title={tile.title} />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}

export default withStyles(styles)(Tiles);
