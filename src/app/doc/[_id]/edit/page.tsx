"use client";
import React from "react";
import Split from "@uiw/react-split";
import { useCodeMirror } from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { pug } from "@codemirror/legacy-modes/mode/pug";

import { useGongoSub, useGongoOne } from "gongo-client-react";
import DocRender from "../DocRender";
import { prepare } from "@/doc/prepare";
import { DocNode } from "@/schemas";

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

const extensions = [StreamLanguage.define(pug)];

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
  const onChange = React.useCallback((value, viewUpdate) => {
    // console.log("value", value);
    // console.log("viewUpdate", viewUpdate);
    // setDocSrc(value);

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setDoc(prepare(value) as unknown as DocNode);
    }, 500);
  }, []);

  React.useEffect(() => {
    if (!doc && dbDoc) setDoc(dbDoc.doc);
  }, [dbDoc, doc]);

  const { setContainer, state, view, setState } = useCodeMirror({
    extensions,
    onChange,
  });

  React.useEffect(() => {
    console.log("state", state);
  }, [state]);
  React.useEffect(() => {
    console.log("view", view);
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
          ref={editorRef}
          style={{
            // width: "70%",
            minWidth: 30,
            height: "100%",
            overflow: "auto",
          }}
        ></div>
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
