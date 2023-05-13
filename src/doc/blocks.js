import React from "react";
import { Node, Render } from "json-rich-text";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import DocContext from "../../src/doc/context.js";

class Title extends Node {
  render(key) {
    return (
      <Paper key={key} sx={{ p: 1, mb: 1, background: "#fff" }}>
        <a name={this.block.text.replace(/ /g, "_")}></a>
        <Typography variant="h5">
          {this.block.value || this.renderChildren()}
        </Typography>
      </Paper>
    );
  }
}

class Grade extends Node {
  render(key) {
    const parts = this.block.grade.split("=");

    return (
      <span
        key={key}
        style={{
          display: "inline-block",
          position: "relative",
          textIndent: "0px",
        }}
      >
        <style jsx>{`
          .circled {
            border: 1px solid;
            border-radius: 50%;
            width: 2.5ch;
            display: inline-block;
            text-align: center;
          }
          .squared {
            border: 1px solid;
            width: 2.5ch;
            display: inline-block;
            text-align: center;
          }
        `}</style>
        <span className="circled">{parts[0]}</span>=
        <span className="squared">{parts[1]}</span>
      </span>
    );
  }
}

class Todo extends Node {
  //type: "todo";

  render(key) {
    return <div key={key}>(TODO: {this.renderChildren()})</div>;
  }
}

class B extends Node {
  render(key) {
    return <b key={key}>{this.renderChildren()}</b>;
  }
}

class I extends Node {
  render(key) {
    return <i key={key}>{this.renderChildren()}</i>;
  }
}

class Img extends Node {
  render(key) {
    // eslint-disable-next-line
    return <img key={key} width="100%" src={this.block.src} />;
  }
}

class Br extends Node {
  render(key) {
    return <br key={key} />;
  }
}

class Var extends Node {
  render(key) {
    // eslint-disable-next-line
    const context = React.useContext(DocContext);
    const variable = context.vars[this.block.name];
    return (
      <span key={key}>
        {variable ? variable.value : `NO SUCH VARIABLE "${this.block.name}"`}
      </span>
    );
  }
}

class DeclareVar extends Node {
  render(key) {
    return null;
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
        {this.renderChildren()}
      </Paper>
    );
  }
}

class Summary extends Node {
  render(key) {
    return (
      <details key={key}>
        <summary>{this.block.summary}</summary>
        {this.renderChildren()}
      </details>
    );
  }
}

class Task extends Node {
  //type: "todo";

  render(key) {
    const block = this.block;
    // eslint-disable-next-line
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
    else if (role === "all-officers")
      forMe = !["candidate", "member"].includes(myRole);
    else if (role.startsWith("all-except-"))
      forMe = !role.substr(11).split(",").includes(myRole);
    else if (role.startsWith("all-officers-except-"))
      forMe =
        !["candidate", "member"].includes(myRole) &&
        !role.substr(20).split(",").includes(myRole);
    else if (role.match(",")) forMe = role.split(",").includes(myRole);

    if (!["all-officers", "all"].includes(role)) {
      const roles = role
        // all-except-XXX, all-officers-except-XXX
        .replace(/^all.*-except-/, "")
        .split(",");
      for (const role of roles)
        if (!context.roles[role])
          console.log(
            "%c Invalid role: " + role,
            "background: #ffa",
            this.block
          );
    }

    const samePreviousRole = this.prev() && this.prev().block.role === role;

    // eslint-disable-next-line
    const ref = React.useRef();
    // eslint-disable-next-line
    React.useEffect(() => {
      this.block.ref = ref;
      this.block.forMe = forMe;
      return () => {
        delete this.block.ref;
        delete this.block.forMe;
      };
    });

    return (
      <div key={key} ref={ref}>
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
              word-break: break-word;
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
                ? [roles[role].symbol, " ", roles[role].name]
                : role.substr(0, 1).toUpperCase() + role.substr(1)}
            </span>
          )}
          <span className="pg">{key}</span>
          {block.say && <div className="say">{this.renderChildren()}</div>}
          {block.do && <div className="do">{this.renderChildren()}</div>}
        </Paper>
      </div>
    );
  }
}

const blocks = {
  b: B,
  br: Br,
  grade: Grade,
  i: I,
  img: Img,
  note: Note,
  task: Task,
  title: Title,
  todo: Todo,
  var: Var,
  declareVar: DeclareVar,
  summary: Summary,
};
Node.registerBlocks(blocks);

// NB: If we don't export "Node", React fast refresh won't pickup Component
// changes.
export { Node, Render };
