import { Box } from "@mui/material";
import React from "react";

export default function OpenSource({ href }: { href: string }) {
  if (!href.includes("://"))
    href = "https://github.com/gadicc/magickli/blob/master" + href;

  return (
    <Box sx={{ mt: 1, mb: 1, fontSize: "80%" }}>
      Magick.li is open-source. You can see the code used to generate this page{" "}
      <a href={href}>here</a>.
    </Box>
  );
}
