import React from "react";
import { Node, Render } from "json-rich-text";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import DocContext from "../../src/doc/context.js";

function applyBrs(str) {
  let i = 0;
  const out = [];
  for (const part of str.split("<br />")) {
    out.push(part);
    out.push(<br key={i++} />);
  }
  return out.slice(0, out.length - 1);
}

class Title extends Node {
  render(key) {
    return (
      <Paper key={key} sx={{ p: 1, mb: 1, background: "#fff" }}>
        <a name={this.block.value.replace(/ /g, "_")}></a>
        <Typography variant="h5">{this.block.value}</Typography>
      </Paper>
    );
  }
}

class Todo extends Node {
  //type: "todo";

  render(key) {
    return <div key={key}>(TODO: {this.block?.title})</div>;
  }
}

class Note extends Node {
  render(key) {
    return (
      <Paper
        key={key}
        style={{ fontStyle: "italic" }}
        sx={{ p: 1, mb: 1, mx: 2.5, background: "#f4f4f4" }}
      >
        {this.block.value}
      </Paper>
    );
  }
}

class Task extends Node {
  //type: "todo";

  render(key) {
    const block = this.block;
    const context = React.useContext(DocContext);
    const vars = context.vars;
    const roles = context.roles;
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
    else if (role.startsWith("all-officers-except-"))
      forMe =
        !["candidate", "member"].includes(myRole) &&
        !role.substr(20).split(",").includes(myRole);

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
          {block.say && <div className="say">{applyBrs(block.say)}</div>}
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
}

const blocks = { title: Title, todo: Todo, note: Note, task: Task };
Node.registerBlocks(blocks);

export { Render };
