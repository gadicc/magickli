import React from "react";

import Box from "@mui/material/Box";

import DocContext from "../../src/doc/context.js";
import AppBar from "../../components/AppBar.js";
import neophyte from "./neophyte.yaml";
import { Render } from "../../src/doc/blocks.js";

const origDoc = { children: neophyte };

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

function Doc() {
  //const doc = { children: [{ type: "text", value: "hi" }] };
  //const [doc, setDoc] = React.useState(origDoc);
  const doc = origDoc;

  const context = { vars: {}, roles };

  for (const varDesc of vars) {
    const [value, set] = React.useState(varDesc.default);
    context.vars[varDesc.name] = { value, set };
  }

  return (
    <>
      <AppBar title="Magick.li" />
      <Box sx={{ background: "#efeae2", p: 2 }}>
        <div>
          {vars.map((v) => (
            <span key={v.name}>
              {v.label}:{" "}
              {(function () {
                if (v.type === "select")
                  return (
                    <select
                      value={context.vars[v.name].value}
                      onChange={(e) => context.vars[v.name].set(e.target.value)}
                    >
                      {v.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  );
                if (v.type === "text")
                  return (
                    <input
                      type="text"
                      value={context.vars[v.name].value}
                      onChange={(e) => context.vars[v.name].set(e.target.value)}
                    />
                  );
              })()}
              <br />
            </span>
          ))}
        </div>
        <br />
        <DocContext.Provider value={context}>
          <Render doc={doc} />
        </DocContext.Provider>
      </Box>
    </>
  );
}

//export default dynamic(Promise.resolve(Doc), { ssr: false });
export default Doc;
