import React from "react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ListIcon from "@mui/icons-material/List";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Stack from "@mui/material/Stack";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";

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

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger} style={{}}>
      {children}
    </Slide>
  );
}

function Doc() {
  //const doc = { children: [{ type: "text", value: "hi" }] };
  //const [doc, setDoc] = React.useState(origDoc);
  const doc = origDoc;

  const context = { vars: {}, roles };

  for (const varDesc of vars) {
    const [value, set] = React.useState(varDesc.default);
    context.vars[varDesc.name] = { value, set };
  }

  const titles = doc.children
    .filter((c) => c.type === "title")
    .map((b) => b.value);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();
  const navParts = [{ title: "Rituals", url: "/hogd/rituals" }];
  const [fontSize, setFontSize] = React.useState(100);

  return (
    <>
      <HideOnScroll>
        <div style={{ position: "fixed", width: "100%" }}>
          <AppBar title={router.query._id} navParts={navParts} />
          <div style={{ background: "#fafafa" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                aria-label="decrease font size"
                component="span"
                onClick={() => setFontSize(fontSize - 5)}
              >
                <RemoveIcon />
              </IconButton>
              <span>{fontSize}%</span>
              <IconButton
                aria-label="increase font size"
                component="span"
                onClick={() => setFontSize(fontSize + 5)}
              >
                <AddIcon />
              </IconButton>
            </Stack>
          </div>
        </div>
      </HideOnScroll>
      <Box
        sx={{ background: "#efeae2", p: 2, pt: 14, fontSize: fontSize + "%" }}
      >
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
      <Tooltip title="Table of Contents">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          aria-controls={open ? "toc" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar>
            <ListIcon />
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="toc"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mb: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              bottom: -10,
              right: 18,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {titles.map((title, i) => (
          <MenuItem
            key={i}
            onClick={() => (location.hash = title.replace(/ /g, "_"))}
          >
            {title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

//export default dynamic(Promise.resolve(Doc), { ssr: false });
export default Doc;
