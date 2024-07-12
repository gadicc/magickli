"use client";
import React from "react";
import Split from "@uiw/react-split";
import { EditorView, Prec, useCodeMirror } from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { Diagnostic, setDiagnostics } from "@codemirror/lint";
import { pug } from "@codemirror/legacy-modes/mode/pug";
import pugLex from "pug-lexer";
import pugParse from "pug-parser";
import {
  useGongoSub,
  useGongoOne,
  db,
  useGongoUserId,
} from "gongo-client-react";

import DocRender from "../DocRender";
import { toJrt } from "@/doc/prepare";
import { DocNode } from "@/schemas";
import { Close, ErrorOutline } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { checkSrc } from "./checkSrc";
import { shortcutHighlighters, transformAndMapShortcuts } from "./shortcuts";

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

const extensions = [
  StreamLanguage.define(pug),
  ...shortcutHighlighters.map(Prec.highest),
];

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
  // console.log("toPos", { line, column, mappings });
  const lineMappings = mappings && mappings[line];
  if (lineMappings) {
    // console.log("lineMappings", lineMappings);
    for (const [from, to, offset] of lineMappings) {
      /*
      console.log({
        line,
        column,
        from: from + offset,
        to: to + offset,
        offset,
        newColumn: column,
      });
      */
      if (column >= from + offset && column <= to + offset + 1) {
        column -= offset;
        // console.log("match, new column: " + column);
        break;
      }
    }
  }

  let pos = 0;
  for (let i = 0; i < line - 1; i++) {
    pos = value.indexOf("\n", pos) + 1;
  }
  // console.log("pos", pos, value.substring(pos, value.indexOf("\n", pos)));
  // console.log("return", pos + column - 1);

  return pos + column - 1;
}

let timeout;
export default function DocEdit({
  params: { _id },
}: {
  params: { _id: string };
}) {
  useGongoSub("doc", { _id });
  useGongoSub("docRevisions", { docId: _id });
  const userId = useGongoUserId();
  const dbDoc = useGongoOne((db) => db.collection("docs").find({ _id }));
  // The parsed (to jrt) doc to be rendered.  Clone it since docRender mutates it.
  const [doc, setDoc] = React.useState(
    dbDoc?.doc && JSON.parse(JSON.stringify(dbDoc.doc))
  );
  const [error, setError] = React.useState<Error | null>(null);
  const viewRef = React.useRef<EditorView | undefined>(undefined);
  const onChange = React.useCallback((value, viewUpdate) => {
    // console.log("value", value);
    // console.log("viewUpdate", viewUpdate);
    // setDocSrc(value);

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const { transformed, mappings } = transformAndMapShortcuts(value);
      try {
        const lexed = pugLex(transformed);
        const parsed = pugParse(lexed, { src: transformed });
        // console.log(parsed);
        const errors = checkSrc(parsed).map((e) => ({
          ...e,
          from: toPos(value, e.from.line, e.from.column, mappings),
          to: toPos(value, e.to.line, e.to.column, mappings),
        }));
        // console.log("errors", errors);
        const view = viewRef.current;
        view?.dispatch(setDiagnostics(view.state, errors));

        const jrt = toJrt(parsed) as unknown as DocNode;
        setDoc(jrt);
        setError(null);
      } catch (error) {
        // console.log(error);
        const match = error.message.match(
          /^Pug:(?<line>\d+):(?<column>\d+)\n(?<inline>[\s\S]+?)\n\n(?<message>.+)$/
        );
        if (match) {
          const { line, column, message, type } = match.groups;
          const pos = toPos(value, Number(line), Number(column), mappings);
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

  const handleKeyDown = React.useCallback(
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "s" && event.ctrlKey) {
        const text = viewRef.current?.state.doc.toString() || "";
        event.preventDefault();

        if (!userId) {
          alert("no userId");
          return;
        }
        console.log("save");
        // console.log(dbDoc);

        const lastRevision = db
          .collection("docRevisions")
          .find({ docId: _id, userId })
          .sort("updatedAt", -1)
          .limit(1)
          .toArraySync()[0];
        // console.log({ lastRevision });

        let revisionId = lastRevision?._id;
        if (
          !lastRevision ||
          lastRevision.updatedAt.getTime() <
            new Date().getTime() - 1000 * 60 * 5
        ) {
          const newRevision = {
            docId: _id,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            text,
            __ObjectIDs: ["docId", "userId"],
          };
          // console.log(newRevision);
          // TODO, gongo returned doc should not have optionalId
          const insertedDoc = db.collection("docRevisions").insert(newRevision);
          revisionId = insertedDoc._id as string;
        } else {
          const result = db
            .collection("docRevisions")
            .update(
              { _id: lastRevision._id },
              { $set: { text, updatedAt: new Date() } }
            );
          // console.log(result);
        }

        db.collection("docs").update(
          { _id },
          {
            $set: {
              doc: JSON.parse(
                JSON.stringify(doc, (key, value) => {
                  // DocRender adds ref to html nodes, which we don't want to save.
                  if (key === "ref") return undefined;
                  return value;
                })
              ),
              revisionId,
              updatedAt: new Date(),
            },
          }
        );
      }
    },
    [_id, userId, doc]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  React.useEffect(() => {
    // i.e. only do this once on load; don't retrigger on doc updates.
    if (!doc && dbDoc) setDoc(JSON.parse(JSON.stringify(dbDoc.doc)));
  }, [dbDoc, doc]);

  const { setContainer, state, view, setState } = useCodeMirror({
    theme: "dark",
    extensions,
    onChange,
    height: "100%",
    width: "100%",
  });

  React.useEffect(() => {
    // console.log("state", state);
  }, [state]);
  React.useEffect(() => {
    // console.log("view", view);
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
          <DocRender doc={doc} wrapWithErrorBoundary={true} />
        </div>
      </Split>
    </div>
  );
}
