import React from "react";
import { useRouter } from "next/router";
import lex from "pug-lexer";
import parse from "pug-parser";

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
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import Popover from "@mui/material/Popover";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import DocContext from "../../src/doc/context.js";
import AppBar from "../../components/AppBar.js";
// import neophyte from "../../src/doc/neophyte.yaml";
import _neophyte from "!!raw-loader!../../src/doc/0=0.jade";
import { Render } from "../../src/doc/blocks.js";

const tokens = lex(_neophyte);
const ast = parse(tokens, { src: _neophyte });

function toJrt(ast) {
  const out = {};

  // if (ast.type === "Block") return ast.nodes.map(toJrt);
  //
  if (ast.type === "Tag") {
    if (ast.name === "say") {
      out.type = "task";
      out.say = true;
    } else if (ast.name === "do") {
      out.type = "task";
      out.do = true;
    } else {
      out.type = ast.name;
    }

    for (let attr of ast.attrs)
      out[attr.name] = attr.val.replace(/^['"]+|['"]+$/g, "");
  } else if (ast.type === "Text") {
    out.type = "text";
    out.value = ast.val;
  }

  if (ast.nodes) out.children = ast.nodes.map(toJrt);
  if (ast.block) out.children = ast.block.nodes.map(toJrt);
  return out;
}

// console.log(JSON.stringify(ast, null, "  "));
// console.log(JSON.stringify(toJrt(ast), null, "  "));

//const origDoc = { children: neophyte };
const origDoc = toJrt(ast);

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
    collapsable: false,
  },
  {
    name: "candidateName",
    label: "Candidate's Name",
    type: "text",
    default: "(Candidate's Name)",
    collapsable: true,
  },
  {
    name: "candidateMotto",
    label: "Candidate's Motto",
    type: "text",
    default: "(Candidate's Motto)",
    collapsable: true,
  },
  {
    name: "templeName",
    label: "Temple",
    type: "text",
    default: "(name)",
    collapsable: true,
  },
  {
    name: "orderName",
    label: "Order's Name",
    type: "text",
    default: "Order of the Stella Matutina",
    collapsable: true,
  },
  {
    name: "witnessed",
    label: "Witnessed/Beheld the",
    type: "text",
    default: "Stella Matutina",
    collapsable: true,
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

function ShowVars({ vars, context }) {
  return vars.map((v) => (
    <span key={v.name}>
      {(function () {
        if (v.type === "select")
          return (
            <FormControl>
              <InputLabel id={"input-" + v.name + "-label"}>
                {v.label}
              </InputLabel>
              <Select
                labelId={"input-" + v.name + "-label"}
                label={v.label}
                value={context.vars[v.name].value}
                onChange={(e) => context.vars[v.name].set(e.target.value)}
              >
                {v.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        if (v.type === "text")
          return (
            <TextField
              label={v.label}
              value={context.vars[v.name].value}
              onChange={(e) => context.vars[v.name].set(e.target.value)}
            />
          );
      })()}
      <br />
      <br />
    </span>
  ));
}

function ZoomMenu({
  anchorEl,
  setAnchorEl,
  onCloseExtra,
  fontSize,
  setFontSize,
}) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={(event) => {
        setAnchorEl(null);
        onCloseExtra(event);
      }}
      anchorOrigin={{ vertical: "center", horizontal: "left" }}
      transformOrigin={{ horizontal: "right", vertical: "center" }}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mr: 1.5,
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
            bottom: 10,
            right: -5,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0}>
        <IconButton
          aria-label="decrease font size"
          onClick={() => setFontSize(fontSize - 5)}
        >
          <RemoveIcon />
        </IconButton>
        <span>{fontSize}%</span>
        <IconButton
          aria-label="increase font size"
          onClick={() => setFontSize(fontSize + 5)}
        >
          <AddIcon />
        </IconButton>
      </Stack>
    </Popover>
  );
}

function TocMenu({ anchorEl, setAnchorEl, titles, onCloseExtra }) {
  return (
    <Menu
      anchorEl={anchorEl}
      id="toc"
      open={!!anchorEl}
      onClose={(event) => {
        setAnchorEl(null);
        onCloseExtra(event);
      }}
      anchorOrigin={{ vertical: "center", horizontal: "left" }}
      transformOrigin={{ horizontal: "right", vertical: "center" }}
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
            top: "50%",
            right: -5,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
    >
      {titles.map((title, i) => (
        <MenuItem
          key={i}
          onClick={() => {
            location.hash = title.replace(/ /g, "_");
            setAnchorEl(null);
            onCloseExtra();
          }}
        >
          {title}
        </MenuItem>
      ))}
    </Menu>
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
    .map((b) => b.text);

  const [sdOpen, setSdOpen] = React.useState(false);
  const [tocAnchorEl, setTocAnchorEl] = React.useState(null);
  const [zoomAnchorEl, setZoomAnchorEl] = React.useState(null);

  const router = useRouter();
  const navParts = [{ title: "Rituals", url: "/hogd/rituals" }];
  const [fontSize, setFontSize] = React.useState(100);

  const [alwaysVars, collapsableVars] = React.useMemo(() => {
    const alwaysVars = [],
      collapsableVars = [];
    for (const variable of vars)
      if (variable.collapsable) collapsableVars.push(variable);
      else alwaysVars.push(variable);
    return [alwaysVars, collapsableVars];
  }, []);

  const [nextPos, setNextPos] = React.useState(0);
  const [currentPos, setCurrentPos] = React.useState(0);
  const jumped = React.useRef();

  React.useEffect(() => {
    function scrollListener(event) {
      let nextPosSet = false;
      let currentPosSet = false;
      const bottom = window.pageYOffset + window.innerHeight;

      // TODO, re-implement with binary search.
      // const start = Date.now();
      for (let i = 0; i < doc.children.length; i++) {
        const node = doc.children[i];
        if (node.type !== "task") continue;
        if (node.forMe && !nextPosSet && node.ref.current.offsetTop > bottom) {
          nextPosSet = true;
          setNextPos(i);
        } else {
          if (!currentPosSet && node.ref.current.offsetTop > bottom) {
            currentPosSet = true;
            setCurrentPos(i - 1);
          }
        }
        if (nextPosSet && currentPosSet) break;
      }
      // console.log("diff " + (Date.now() - start) + "ms");
      // console.log(window.pageYOffset);
    }
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, [doc.children]);

  // console.log({ currentPos, nextPos });

  return (
    <>
      <HideOnScroll>
        <div style={{ position: "fixed", width: "100%", zIndex: 1000 }}>
          <AppBar title={router.query._id} navParts={navParts} />
        </div>
      </HideOnScroll>
      <Box
        sx={{ background: "#efeae2", p: 2, pt: 10, fontSize: fontSize + "%" }}
      >
        <div>
          <ShowVars vars={alwaysVars} context={context} />
          <details>
            <summary>More Variables</summary>
            <br />
            <ShowVars vars={collapsableVars} context={context} />
          </details>
        </div>

        <br />
        <DocContext.Provider value={context}>
          <Render doc={doc} />
        </DocContext.Provider>
      </Box>

      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={nextPos - currentPos}
        open={sdOpen}
        onOpen={(event, reason) => {
          // "mouseEnter", "focus"
          if (["toggle"].includes(reason)) setSdOpen(true);
        }}
        onClose={(event, reason) => {
          // "blur", "mouseLeave"
          if (["toggle", "escapeKeyDown"].includes(reason)) setSdOpen(false);
        }}
      >
        {jumped.current ? (
          <SpeedDialAction
            icon=<ArrowUpwardIcon />
            tooltipTitle="Jump Back"
            onClick={() => {
              window.scrollTo(0, jumped.current);
              jumped.current = false;
            }}
          />
        ) : (
          <SpeedDialAction
            icon=<ArrowDownwardIcon />
            tooltipTitle="Jump to Next"
            onClick={() => {
              jumped.current = window.pageYOffset;
              doc.children[nextPos].ref.current.scrollIntoView(false);
            }}
          />
        )}
        <SpeedDialAction
          icon=<ListIcon />
          tooltipTitle="Table of Contents"
          onClick={(event) => {
            tocAnchorEl
              ? setTocAnchorEl(null)
              : setTocAnchorEl(event.currentTarget);
          }}
        />
        <SpeedDialAction
          icon=<ZoomInIcon />
          tooltipTitle="Zoom In/Out"
          onClick={(event) => setZoomAnchorEl(event.currentTarget)}
        />
        ))
      </SpeedDial>

      <ZoomMenu
        anchorEl={zoomAnchorEl}
        setAnchorEl={setZoomAnchorEl}
        onCloseExtra={() => setSdOpen(false)}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
      <TocMenu
        anchorEl={tocAnchorEl}
        setAnchorEl={setTocAnchorEl}
        onCloseExtra={() => setSdOpen(false)}
        titles={titles}
      />
    </>
  );
}

//export default dynamic(Promise.resolve(Doc), { ssr: false });
export default Doc;
