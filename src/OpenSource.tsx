import { Box } from "@mui/material";
import React from "react";

const github = "https://github.com/gadicc/magickli/";
const url = (str) =>
  str.startsWith("http") ? str : github + "blob/master" + str;

export default function OpenSource({
  href,
  files,
}: {
  href?: string;
  files?: string[];
}) {
  if (!(href || files)) throw new Error("href or files must be provided");

  return (
    <Box sx={{ mt: 1, mb: 1, fontSize: "80%" }}>
      Magick.ly is open-source. You can see the code used to generate this page
      in{" "}
      {href ? (
        <a href={url(href)}>{href.split("/").pop()}</a>
      ) : (
        files!.map((file, i) => (
          <>
            <a key={file} href={url(file)}>
              {file}
            </a>
            {i === files!.length - 2
              ? " and "
              : i === files!.length - 1
              ? ""
              : ", "}
          </>
        ))
      )}
      .
    </Box>
  );
}
