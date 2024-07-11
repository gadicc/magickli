"use client";
import React from "react";
import Split from "@uiw/react-split";
import {
  Decoration,
  EditorView,
  MatchDecorator,
  Prec,
  RangeSet,
  ViewPlugin,
  useCodeMirror,
} from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { Diagnostic, setDiagnostics } from "@codemirror/lint";
import { pug } from "@codemirror/legacy-modes/mode/pug";
import pugLex from "pug-lexer";
import pugParse from "pug-parser";
import { useGongoSub, useGongoOne } from "gongo-client-react";

import DocRender from "../DocRender";
import { prepare, toJrt } from "@/doc/prepare";
import { DocNode } from "@/schemas";
import { Close, ErrorOutline } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { checkSrc } from "./checkSrc";

const starterDoc = `declareVar(
  name="myRole",
  label="My role",
  varType="select",
  default="member",
  collapsable=false
)
  option(value="imperator", label="Imperator")
  option(value="praemonstrator", label="Praemonstrator")
  option(value="cancellarius", label="Cancellarius")
  option(value="hierophant", label="Hierophant")
  option(value="pastHierophant", label="Past Hierophant")
  option(value="hiereus", label="Hiereus")
  option(value="hegemon", label="Hegemon")
  option(value="keryx", label="Keryx")
  option(value="stolistes", label="Stolistes")
  option(value="dadouchos", label="Dadouchos")
  option(value="sentinel", label="Sentinel")
  option(value="candidate", label="Candidate")
  option(value="member", label="Member")
declareVar(
  name="candidateName",
  label="Candidate's Name",
  varType="text",
  default="(Candidate's Name)",
  collapsable
)
declareVar(
  name="candidateMotto",
  label="Candidate's Motto",
  varType="text",
  default="(Candidate's Motto)",
  collapsable
)
declareVar(
  name="templeName",
  label="Temple",
  varType="text",
  default="(name)",
  collapsable
)
declareVar(
  name="orderName",
  label="Order's Name",
  varType="text",
  default="Order of the Stella Matutina",
  collapsable
)
declareVar(
  name="witnessed",
  label="Witnessed/Beheld the",
  varType="text",
  default="Stella Matutina",
  collapsable
)
title(text="Opening of the Hall of the Neophytes")
  | Opening of the Hall of the Neophytes
todo diagram
todo officers, required
note 
  | ✊ - This sign represents one knock made by rapping the base or shaft
  | of wand or the pommel of a sword on the table.
do(role="hierophant")
  | Waits until all members assembled and robed, then ✊
do(role="member") Sit in proper places
do(role="all-officers") Rise
do(role="member")
  | Do not rise except for adorations to the east or when asked for the
  | signs.
  br
  br
  | Stand when Hierophant says "Let us adore the Lord of the universe and
  | space" and face east until end of adoration.
  br
  br
  | Do not circumambulate with
  | officers, but when moving for other purposes, do so in the direction of the sun and
  | make the Neophyte signs on passing the Throne of the East whether the Hierophant is
  | there or not.
  | The sign is always made in direction of movement except:
  | 1) When entering or leaving the hall: made towards the east.
  | 2) When asked to give the signs: towards the altar.
do(role="hierophant") ✊
`;

const shortcutDecorators = [
  new MatchDecorator({
    regexp: /^\* ([A-Za-z,]+) /g,
    // decoration: Decoration.mark({ attributes: { style: "color: cyan" } }),
    decorate(add, from, to, match, view) {
      add(
        from + 2,
        to,
        Decoration.mark({ attributes: { style: "color: cyan" } })
      );
    },
  }),
  new MatchDecorator({
    regexp: /^([A-Za-z,]+):/g,
    // decoration: Decoration.mark({ attributes: { style: "color: cyan" } }),
    decorate(add, from, to, match, view) {
      add(
        from,
        to - 1,
        Decoration.mark({ attributes: { style: "color: cyan" } })
      );
    },
  }),
];

const shortcutHighlighters = shortcutDecorators.map((decorator) =>
  ViewPlugin.fromClass(
    class {
      decorations: RangeSet<Decoration>;

      constructor(view) {
        this.decorations = decorator.createDeco(view);
      }
      update(update) {
        this.decorations = decorator.updateDeco(update, this.decorations);
      }
    },
    { decorations: (v) => v.decorations }
  )
);

const extensions = [
  StreamLanguage.define(pug),
  // ...shortcutHighlighters.map(Prec.highest),
];

function shortcuts(input: string) {
  const mappings: Record<number, [number, number, number][]> = {};
  const lines = input.split("\n");
  for (let line = 0; line < lines.length; line++) {
    const lineStr = lines[line];
    let match;
    if ((match = lineStr.match(/^([A-Za-z,]+):/))) {
      const lineMappings = mappings[line + 1] || (mappings[line + 1] = []);
      const pre = 'say(role="';
      const post = '")';
      const shortenedBy = 1; // matches that aren't kept, i.e. ":"
      const replacement = pre + match[1].toLowerCase() + post;
      const offset = replacement.length - match[0].length;

      console.log(lines[line]);
      lines[line] = replacement + lineStr.slice(match[0].length);
      console.log(lines[line]);
      lineMappings.push([0, match[0].length - 1, offset - shortenedBy]);
      lineMappings.push([
        match[0].length + 1, // include the ":"
        lineStr.length,
        offset - shortenedBy,
      ]);
    } else if (
      (match = lineStr.match(/^(?<skip>\* ?)(?<role>[A-Za-z,]*)(?<rest>.*)$/))
    ) {
      console.log(match);
      const lineMappings = mappings[line + 1] || (mappings[line + 1] = []);
      const { skip, role, rest } = match.groups;

      if (!role) {
        lines[line] = "";
        continue;
      }

      const pre = 'do(role="';
      const post = '")';
      const replacement = pre + role.toLowerCase() + post;
      console.log(lines[line]);
      lines[line] = replacement + rest;
      const offset = console.log(lines[line]);
      lineMappings.push([
        skip.length,
        skip.length + role.length,
        pre.length - skip.length,
      ]);
      lineMappings.push([
        skip.length + role.length,
        lineStr.length,
        pre.length - skip.length,
      ]);
    }
  }

  const transformed = lines.join("\n");
  return {
    transformed,
    mappings,
  };
}

function ShowError({
  error,
  setError,
}: {
  error: Error | null;
  setError: (error: Error | null) => void;
}) {
  return (
    <div
      style={{
        display: error ? "block" : "none",
        position: "absolute",
        left: 25,
        bottom: 15,
        borderRadius: 5,
        background: "#ff5555",
        padding: "2px 5px 2px 10px",
        fontWeight: 500,
        color: "white",
        boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.25)",
      }}
    >
      <ErrorOutline sx={{ verticalAlign: "middle" }} />
      <span style={{ verticalAlign: "middle", padding: "0 5px 0 10px" }}>
        {error?.message}
      </span>
      <IconButton
        sx={{ verticalAlign: "middle" }}
        onClick={() => setError(null)}
      >
        <Close />
      </IconButton>
    </div>
  );
}

function toPos(
  value: string,
  line: number,
  column: number,
  mappings?: Record<number, [number, number, number][]>
) {
  console.log("toPos", { line, column, mappings });
  const lineMappings = mappings && mappings[line];
  if (lineMappings) {
    console.log("lineMappings", lineMappings);
    for (const [from, to, offset] of lineMappings) {
      console.log({
        line,
        column,
        from: from + offset,
        to: to + offset,
        offset,
        newColumn: column,
      });
      if (column >= from + offset && column <= to + offset + 1) {
        console.log("match");
        column -= offset;
        break;
      }
    }
  }

  let pos = 0;
  for (let i = 0; i < line - 1; i++) {
    pos = value.indexOf("\n", pos) + 1;
  }

  return pos + column - 1;
}

let timeout;
export default function DocEdit({
  params: { _id },
}: {
  params: { _id: string };
}) {
  useGongoSub("doc", { _id });
  const dbDoc = useGongoOne((db) => db.collection("docs").find({ _id }));
  const [doc, setDoc] = React.useState(dbDoc?.doc);
  const [docSrc, setDocSrc] = React.useState(starterDoc);
  const [error, setError] = React.useState<Error | null>(null);
  const viewRef = React.useRef<EditorView | undefined>(undefined);
  const onChange = React.useCallback((value, viewUpdate) => {
    // console.log("value", value);
    // console.log("viewUpdate", viewUpdate);
    // setDocSrc(value);

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      let transformed, mappings;
      try {
        const { transformed: _transformed, mappings: _mappings } =
          shortcuts(value);
        // @ts-expect-error: ok
        window.transformed = transformed = _transformed;
        // @ts-expect-error: ok
        window.mappings = mappings = _mappings;
        const lexed = pugLex(transformed);
        const parsed = pugParse(lexed, { src: transformed });
        // console.log(parsed);
        const errors = checkSrc(parsed).map((e) => ({
          ...e,
          from: toPos(transformed, e.from.line, e.from.column, mappings),
          to: toPos(transformed, e.to.line, e.to.column, mappings),
        }));
        const view = viewRef.current;
        view?.dispatch(setDiagnostics(view.state, errors));

        const jrt = toJrt(parsed) as unknown as DocNode;
        setDoc(jrt);
        setError(null);
      } catch (error) {
        console.log(error);
        const match = error.message.match(
          /^Pug:(?<line>\d+):(?<column>\d+)\n(?<inline>[\s\S]+?)\n\n(?<message>.+)$/
        );
        if (match) {
          const { line, column, message, type } = match.groups;
          const pos = toPos(
            transformed,
            Number(line),
            Number(column),
            mappings
          );
          const diagnostics: Diagnostic[] = [
            {
              from: pos,
              to: pos,
              message,
              severity: "error" as const,
              // source: type,
            },
          ];
          const view = viewRef.current;
          view?.dispatch(setDiagnostics(view.state, diagnostics));
        } else {
          setError(error);
        }
      }
    }, 300);
  }, []);

  React.useEffect(() => {
    if (!doc && dbDoc) setDoc(dbDoc.doc);
  }, [dbDoc, doc]);

  const { setContainer, state, view, setState } = useCodeMirror({
    theme: "dark",
    extensions,
    onChange,
    height: "100%",
    width: "100%",
  });

  React.useEffect(() => {
    console.log("state", state);
  }, [state]);
  React.useEffect(() => {
    console.log("view", view);
    viewRef.current = view;
    if (view)
      view.dispatch({
        changes: {
          from: 0,
          insert: starterDoc,
        },
      });
  }, [view]);

  const editorRef = React.useCallback(
    (node) => {
      setContainer(node);
    },
    [setContainer]
  );

  if (!doc) return <div>Loading or not found...</div>;

  return (
    <div style={{ height: "calc(100vh - 64px)", overflow: "hidden" }}>
      <Split>
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <div
            ref={editorRef}
            style={{ height: "100%", width: "100%", overflow: "auto" }}
          />
          <ShowError error={error} setError={setError} />
        </div>
        <div
          style={{
            // width: "30%",
            width: 720,
            minWidth: 100,
            height: "100%",
            overflow: "auto",
          }}
        >
          <DocRender doc={doc} />
        </div>
      </Split>
    </div>
  );
}
