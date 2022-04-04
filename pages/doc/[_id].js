import React from "react";
import { Render } from "json-rich-text";

import AppBar from "../../components/AppBar.js";
import neophyte from "./neophyte.yaml";
const doc = { children: neophyte };

console.log({ doc });

export default function Doc() {
  //const doc = { children: [{ type: "text", value: "hi" }] };

  return (
    <>
      <AppBar title="Magick.li" />
      <Render doc={doc} />
    </>
  );
}
