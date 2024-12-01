import withStyles from "@mui/styles/withStyles";
import {
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import Link from "@/lib/link";

function Tiles({ tiles }) {
  return (
    <Grid container spacing={0}>
      {tiles.map((tile) => (
        <Grid
          item
          key={tile.to}
          xs={6}
          sm={4}
          md={3}
          sx={{
            height: 180,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Link href={tile.to}>
            {tile.Component ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  overflow: "hidden",
                }}
              >
                <tile.Component
                  height="100%"
                  // className="MuiGridListTile-imgFullHeight"
                />
              </div>
            ) : (
              // eslint-disable-next-line
              <img
                src={typeof tile.img === "object" ? tile.img.src : tile.img}
                alt={tile.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
            <ImageListItemBar
              sx={{ background: "rgba(0, 0, 0, 0.6)" }}
              title={tile.title}
            />
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}

export default Tiles;
