import React from "react";
import dynamic from "next/dynamic";

// v1.1.1 without cjs.  TODO i guess.
import { Render, registerBlockType } from "json-rich-text";
//import Node from "json-rich-text/lib/esm/blocks/node.js";

import AppBar from "../../components/AppBar.js";
import neophyte from "./neophyte.yaml";

const origDoc = { children: neophyte };

const win = typeof window === "object";
if (win) {
  (async function () {
    const Node = (await import("json-rich-text/lib/esm/blocks/node.js"))
      .default;
    console.log({ Node });

    const types = {
      todo: class Todo2 extends Node {
        //type: "todo";

        render(key) {
          return <div key={key}>{this.block?.title}</div>;
        }
      },

      task: class Task extends Node {
        //type: "todo";

        render(key) {
          return <div key={key}>{this.block?.title}</div>;
        }
      },
    };

    for (const [key, val] of Object.entries(types)) registerBlockType(key, val);
  })();
}

function Doc() {
  //const doc = { children: [{ type: "text", value: "hi" }] };
  const [doc, setDoc] = React.useState(origDoc);
  window.setDoc = setDoc;
  window.origDoc = origDoc;

  return (
    <>
      <AppBar title="Magick.li" />
      <Render doc={doc} />
    </>
  );
}

export default dynamic(Promise.resolve(Doc), { ssr: false });
