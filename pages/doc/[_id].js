import React from "react";
import dynamic from "next/dynamic";

// v1.1.1 without cjs.  TODO i guess.
import { Render, registerBlockType } from "json-rich-text";
//import Node from "json-rich-text/lib/esm/blocks/node.js";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

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
      title: class Title extends Node {
        render(key) {
          return (
            <Paper sx={{ p: 1, mb: 1, background: "#fff" }}>
              <Typography variant="h5">{this.block.value}</Typography>
            </Paper>
          );
        }
      },

      todo: class Todo2 extends Node {
        //type: "todo";

        render(key) {
          return <div key={key}>(TODO: {this.block?.title})</div>;
        }
      },

      task: class Task extends Node {
        //type: "todo";

        render(key) {
          const block = this.block;

          /*
          let roles;
          if (typeof this.block.role === "string") roles = [block.role];
          else if (Array.isArray(block.role)) roles = block.role;
          else if (typeof block.role === "object") {
            // TODO
            roles = ["all (except: " + block.role["all-except"] + ")"];
          } else
            throw new Error("Unknown role type: " + JSON.stringify(block.role));
          */
          const myRole = "hierophant";
          const role = block.role;
          const forMe =
            role === myRole ||
            (role.startsWith("all") && !role.endsWith("except-" + myRole));

          return (
            <div key={key}>
              <Paper
                sx={{
                  px: 2,
                  py: 1,
                  mb: 1.6,
                  ml: forMe ? 5 : 0,
                  mr: forMe ? 0 : 5,
                  background: forMe && "#d9fdd3",
                }}
              >
                <style jsx>{`
                  .say::before {
                    content: open-quote;
                    font-size: 120%;
                  }
                  .say::after {
                    content: close-quote;
                    font-size: 120%;
                  }
                  .say {
                    quotes: "“" "”" "‘" "’";
                    text-indent: -0.45em;
                    margin-block-start: 0;
                    margin-block-end: 0.5em;
                    margin-inline-start: 5px;
                    margin-inline-end: 0;
                  }
                  .do {
                    font-style: italic;
                  }
                  .do::before {
                    content: "*";
                  }
                  .do::after {
                    content: "*";
                  }
                  .role {
                    color: blue;
                  }
                `}</style>
                {role !== myRole && (
                  <span className="role">
                    {role.substr(0, 1).toUpperCase() + role.substr(1)}
                  </span>
                )}
                {block.say && <div className="say">{block.say}</div>}
                {block.do && <div className="do">{block.do}</div>}
              </Paper>
            </div>
          );
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
      <Box sx={{ background: "#efeae2", p: 2 }}>
        <Render doc={doc} />
      </Box>
    </>
  );
}

export default dynamic(Promise.resolve(Doc), { ssr: false });
