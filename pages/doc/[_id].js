import React from "react";
import { useRouter } from "next/router";
import { useGongoSub, useGongoOne } from "gongo-client-react";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ListIcon from "@mui/icons-material/List";
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
import SpeedDialAction from "@mui/material/SpeedDialAction";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import Popover from "@mui/material/Popover";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import DocContext from "../../src/doc/context";
import AppBar from "../../components/AppBar";
import { Render } from "../../src/doc/blocks";
import "../../public/fonts/FrankRuehlCLM-stylesheet.css";

import { prepare } from "../../src/doc/prepare";
// import neophyte from "../../src/doc/neophyte.yaml";
import _neophyte from "!!raw-loader!../../src/doc/0=0.jade";
// import _neophyteM from "!!raw-loader!../../src/doc/0=0m.jade";
import _zelator from "!!raw-loader!../../src/doc/1=10.jade";
// import _healing from "!!raw-loader!../../src/doc/healing.jade";
// import _chesedTalisman from "!!raw-loader!../../src/doc/chesed-talisman.jade";

const docs = {
  neophyte: prepare(_neophyte),
  zelator: prepare(_zelator),
  // neophyteM: prepare(_neophyteM),
  // healing: prepare(_healing),
  // "chesed-talisman": prepare(_chesedTalisman),
};

// Note: make sure not to export anything except the react component
// in this file, otherwise React Fast Refresh will need to do a
// Full Reload.

function PraemonstratorWand({ size }) {
  return (
    <svg
      version="1.1"
      id="svg1981"
      width={size}
      height={size}
      viewBox="0 0 600 600"
    >
      <g
        id="g1987"
        transform="matrix(3.7795276,0,0,3.7795276,-78.450732,-145.97385)"
        style={{
          fillRule: "evenodd",
          stroke: "#000000",
          strokeWidth: 4,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
      >
        <path
          style={{ fill: "#a02c2c" }}
          d="M 21.289256,180.58781 V 57.347003 l 77.802218,60.829677 z"
          id="path377-7"
        />
        <path
          style={{ fill: "#ffcc00" }}
          d="M 37.974882,39.154747 H 161.21579 L 100.38606,116.957 Z"
          id="path377-7-5"
        />
        <path
          style={{ fill: "#1a1a1a" }}
          d="M 37.974363,197.09104 H 161.21522 l -60.82973,-77.80222 z"
          id="path377-7-5-3"
        />
        <path
          style={{ fill: "#5555ff" }}
          d="M 179.34721,55.753403 V 178.99426 l -77.80222,-60.82973 z"
          id="path377-7-5-3-5"
        />
      </g>
    </svg>
  );
}

function Cross({ size, bg, fg }) {
  return (
    <svg width={size} height={size} viewBox="-5 -5 10 10">
      <circle cx="0" cy="0" r="5" fill={bg} />
      <circle cx="0" cy="-1" r="2" stroke={fg} strokeWidth="0.5" fill="none" />
      <g strokeWidth="1.8">
        <path d="M -3.4,-1 L 3.4,-1" stroke={fg} />
        <path d="M 0,-4 L 0,4" stroke={fg} />
      </g>
    </svg>
  );
}

const roles = {
  imperator: {
    name: "Imperator",
    symbol: <Cross fg="#3f3" bg="#f33" size={14} key="symbol" />,
    color: "red",
  },
  praemonstrator: {
    name: "Praemonstrator",
    symbol: <PraemonstratorWand size={13} key="symbol" />,
    color: "blue",
  },
  cancellarius: {
    name: "Cancellarius",
    symbol: "✡︎",
    color: "#ca0",
  },
  hierophant: { name: "Hierophant", symbol: "🕈", color: "red" },
  pastHierophant: { name: "Past Hierophant", symbol: "(🕈)", color: "red" },
  hiereus: { name: "Hiereus", symbol: "▲", color: "black" },
  hegemon: { name: "Hegemon", symbol: "✝", color: "#aaa" },
  keryx: { name: "Keryx", symbol: "☤", color: "#c55" },
  stolistes: { name: "Stolistes", symbol: "🏆", color: "#55c" },
  dadouchos: { name: "Dadouchos", symbol: "卍", color: "#cc5" },
  sentinel: { name: "Sentinel", symbol: "𓂀", color: "#777" },
  candidate: { name: "Candidate", symbol: "🤠", color: "#fcf" },
  aspirant: { name: "Aspirant", symbol: "🤒", color: "#fcf" },
  member: { name: "Member", color: "#ccc" },
  psaltis: { name: "Psaltis", symbol: "🎵", color: "#c55" },
};

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
  return vars
    .filter((v) => !v.hidden)
    .map((v) => (
      <span key={v.name}>
        {(function () {
          if (v.varType === "select")
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
                  {v.children.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          if (v.varType === "text")
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

function DocLoader() {
  const router = useRouter();
  const _id = router.query._id;

  const builtinDoc = docs[_id];
  useGongoSub("doc", !builtinDoc && { _id });
  const dbDoc = useGongoOne(
    (db) => !builtinDoc && db.collection("docs").find({ _id })
  );

  const doc = builtinDoc || (dbDoc && dbDoc.doc);

  if (!doc) return <div>Loading or not found...</div>;

  return <Doc doc={doc} />;
}

// Ok for whatever reason this stops the error but doesn't "catch" it (i.e. no logs)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error(1, error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    console.error(2, error, info /*.componentStack */);
  }

  render() {
    // console.log(this.state);
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function Doc({ doc }) {
  // console.log({ doc });
  const router = useRouter();
  //const doc = { children: [{ type: "text", value: "hi" }] };
  //const [doc, setDoc] = React.useState(origDoc);

  const titles = doc.children
    .filter((c) => c.type === "title")
    .map((b) => b.text);

  const vars = doc.children.filter((c) => c.type === "declareVar");

  const [sdOpen, setSdOpen] = React.useState(false);
  const [tocAnchorEl, setTocAnchorEl] = React.useState(null);
  const [zoomAnchorEl, setZoomAnchorEl] = React.useState(null);

  const navParts = [{ title: "Rituals", url: "/hogd/rituals" }];
  const [fontSize, setFontSize] = React.useState(100);

  const context = { vars: {}, roles };
  for (const varDesc of vars) {
    // const [value, set] = React.useState(varDesc.default);
    const value =
      router.query[varDesc.name] === undefined
        ? varDesc.default
        : router.query[varDesc.name];
    const set = (value) =>
      router.replace(
        { query: { ...router.query, [varDesc.name]: value } },
        undefined,
        {
          scroll: false,
          shallow: true,
        }
      );
    context.vars[varDesc.name] = { value, set };
  }

  const [alwaysVars, collapsableVars] = React.useMemo(() => {
    // console.log(vars);
    const alwaysVars = [],
      collapsableVars = [];
    for (const variable of vars)
      if (variable.collapsable) collapsableVars.push(variable);
      else alwaysVars.push(variable);
    return [alwaysVars, collapsableVars];
  }, [vars]);

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

        <div
          className="docBody"
          style={
            {
              // fontFamily: "Frank Ruehl CLM, Roboto, Helvetica, Arial, sans-serif",
            }
          }
        >
          <DocContext.Provider value={context}>
            {process.env.NODE_ENV === "development" ? (
              <ErrorBoundary>
                <Render doc={doc} />
              </ErrorBoundary>
            ) : (
              <Render doc={doc} />
            )}
          </DocContext.Provider>
        </div>
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
export default DocLoader;
