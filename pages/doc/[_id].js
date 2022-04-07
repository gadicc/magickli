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
    // console.log({ Node });

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

      todo: class Todo extends Node {
        //type: "todo";

        render(key) {
          return <div key={key}>(TODO: {this.block?.title})</div>;
        }
      },

      note: class Note extends Node {
        render(key) {
          return (
            <Paper
              style={{ fontStyle: "italic" }}
              sx={{ p: 1, mb: 1, mx: 2.5, background: "#f4f4f4" }}
            >
              {this.block.value}
            </Paper>
          );
        }
      },

      task: class Task extends Node {
        //type: "todo";

        render(key) {
          const block = this.block;
          const vars = React.useContext(VarContext);
          // console.log({ myRole: vars.myRole.value });

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
          const myRole = vars.myRole.value; // "hierophant"

          let forMe,
            role = block.role;

          if (role === myRole || role === "all") forMe = true;
          else if (role.match(",")) forMe = role.split(",").includes(myRole);
          else if (role.startsWith("all-except-"))
            forMe = !role.substr(11).split(",").includes(myRole);
          else if (role === "all-officers")
            forMe = !["candidate", "member"].includes(myRole);

          const samePreviousRole = this.prev().block.role === role;

          return (
            <div key={key}>
              <Paper
                sx={{
                  px: 2,
                  pt: 1,
                  pb: 1,
                  mb: 1.6,
                  mt: samePreviousRole ? -1.0 : 0,
                  ml: forMe ? 5 : 0,
                  mr: forMe ? 0 : 5,
                  background: forMe && "#d9fdd3",
                  position: "relative",
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
                  }
                  .pg {
                    position: absolute;
                    right: 8px;
                    top: 6px;
                    color: #ddd;
                  }
                `}</style>
                {role !== myRole && !samePreviousRole && (
                  <span className="role" style={{ color: roles[role]?.color }}>
                    {roles[role]
                      ? roles[role].symbol + " " + roles[role].name
                      : role.substr(0, 1).toUpperCase() + role.substr(1)}
                  </span>
                )}
                <span className="pg">{key}</span>
                {block.say && <div className="say">{block.say}</div>}
                {block.do && (
                  <div className="do">
                    {block.do.endsWith(".")
                      ? block.do.substr(0, block.do.length - 1)
                      : block.do}
                  </div>
                )}
              </Paper>
            </div>
          );
        }
      },
    };

    for (const [key, val] of Object.entries(types)) registerBlockType(key, val);
  })();
}

const roles = {
  hierophant: { name: "Hierophant", symbol: "🕈", color: "red" },
  hiereus: { name: "Hiereus", symbol: "▲", color: "black" },
  hegemon: { name: "Hegemon", symbol: "✝", color: "#aaa" },
  keryx: { name: "Keryx", symbol: "☤", color: "#c55" },
  stolistes: { name: "Stolistes", symbol: "☕", color: "#55c" },
  dadouchos: { name: "Dadouchos", symbol: "卍", color: "#cc5" },
  sentinel: { name: "Sentinel", symbol: "𓂀", color: "#777" },
  candidate: { name: "Candidate", symbol: "🤠", color: "#fcf" },
  member: { name: "Member", color: "#ccc" },
};

const vars = [
  {
    name: "myRole",
    label: "My role",
    type: "select",
    options: Object.keys(roles).map((role) => ({
      value: role,
      label: roles[role].name,
    })),
    default: "member",
  },
  {
    name: "candidateName",
    label: "Candidate's Name",
    type: "text",
    default: "(Candidate's Name)",
  },
  {
    name: "candidateMotto",
    label: "Candidate's Motto",
    type: "text",
    default: "(Candidate's Motto)",
  },
];

const VarContext = React.createContext();

function Doc() {
  //const doc = { children: [{ type: "text", value: "hi" }] };
  const [doc, setDoc] = React.useState(origDoc);

  const varState = {};
  for (const varDesc of vars) {
    const [value, set] = React.useState(varDesc.default);
    varState[varDesc.name] = { value, set };
  }

  return (
    <>
      <AppBar title="Magick.li" />
      <Box sx={{ background: "#efeae2", p: 2 }}>
        <div>
          {vars.map((v) => (
            <span>
              {v.label}:{" "}
              {(function () {
                if (v.type === "select")
                  return (
                    <select
                      onChange={(e) => varState[v.name].set(e.target.value)}
                    >
                      {v.options.map((option) => (
                        <option
                          value={option.value}
                          selected={option.value === varState[v.name].value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  );
                if (v.type === "text")
                  return (
                    <input
                      type="text"
                      value={varState[v.name].value}
                      onChange={(e) => varState[v.name].set(e.target.value)}
                    />
                  );
              })()}
              <br />
            </span>
          ))}
        </div>
        <br />
        <VarContext.Provider value={varState}>
          <Render doc={doc} />
        </VarContext.Provider>
      </Box>
    </>
  );
}

export default dynamic(Promise.resolve(Doc), { ssr: false });
