"use client";
import React from "react";
import { Message, useChat } from "ai/react";
import ReactMarkdown from "react-markdown";

import {
  Add,
  AddCircle,
  AddOutlined,
  Autorenew,
  DeleteForever,
  ExpandMore,
  HourglassTop,
  Person,
  PlusOne,
  Send,
  StopCircle,
} from "@mui/icons-material";

import AppBar from "../components/AppBar";
import Admin from "./admin";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

function metaMessage(message: Message) {
  const parts = message.content.split("\n__META_JSON__\n");
  return {
    ...message,
    content: parts[0],
    meta: parts[1] ? JSON.parse(parts[1]) : null,
  };
}

export default function Chat() {
  const ref = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
    stop,
  } = useChat();
  // console.log({ messages, input, isLoading });
  React.useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
    // ref.current?.scrollIntoViewIfNeeded();
    // console.log({ messages });
  }, [messages]);

  return (
    <>
      <AppBar title="MagickGPT" />

      <div id="messages">
        {messages.map(metaMessage).map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              padding: "2px 15px 2px 15px",
              backgroundColor: m.role === "assistant" ? "#f7f7f7" : "",
              borderTop: m.role === "assistant" ? "1px solid #ccc" : "",
              borderBottom: m.role === "assistant" ? "1px solid #ccc" : "",
            }}
          >
            <div style={{ width: "50px", marginTop: "19px" }}>
              {m.role === "user" ? (
                <Person />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/pentagram.png"
                  alt="AI User"
                  width="32px"
                  height="32px"
                />
              )}
            </div>
            <div style={{ width: "50px", flexGrow: 1 }}>
              <ReactMarkdown linkTarget="_blank">{m.content}</ReactMarkdown>
              {(function () {
                if (m.meta) {
                  const docs = m.meta.sourceDocuments.filter(
                    (doc) => doc.pageContent.length > 5
                  );
                  if (docs.length === 0) return null;
                  return (
                    <details>
                      <summary>Sources</summary>
                      <ol>
                        <style jsx>{`
                          li {
                            font-size: 90%;
                          }
                          li + li {
                            margin-top: 1em;
                          }
                        `}</style>
                        {docs.map((doc, i) => (
                          <li key={i}>
                            <details>
                              <summary>
                                {" "}
                                <i>{doc.metadata["pdf.info.Title"]}</i>,{" "}
                                {doc.metadata["pdf.info.Author"]}, page{" "}
                                {doc.metadata["loc.pageNumber"]}.
                              </summary>
                              <p style={{ fontSize: "75%" }}>
                                {doc.pageContent}
                              </p>
                            </details>
                          </li>
                        ))}
                      </ol>
                    </details>
                  );
                }
              })()}
              {/*
              {m.meta && (
                <>
                  {m.meta.sourceDocuments.map((doc, i) =>
                    doc.pageContent.length < 5 ? null : (
                      <Box key={i} sx={{ mb: 1 }}>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>Source {i + 1}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <p style={{ fontSize: "75%" }}>{doc.pageContent}</p>
                            <p>
                              {/* <b>Source:</b>{" "} */
              /*}
                              <i>{doc.metadata["pdf.info.Title"]}</i>,{" "}
                              {doc.metadata["pdf.info.Author"]}, page{" "}
                              {doc.metadata["loc.pageNumber"]}.
                            </p>
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    )
                  )}
                </>
              )}
            */}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: "130px" }}>&nbsp;</div>
      <div ref={ref}></div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          padding: "15px 10px 10px 10px",
          width: "100%",
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 12px)",
        }}
      >
        {messages.length > 1 && !isLoading && (
          <div
            style={{
              bottom: 80,
              left: 0,
              position: "fixed",
              padding: "10px",
              textAlign: "center",
              width: "100%",
            }}
          >
            <Chip
              icon={<Autorenew fontSize="small" />}
              label="Regenerate Response"
              onClick={() => reload()}
              sx={{
                "&:hover": {
                  background: "#dadada",
                },
                border: "1px solid #dfdfdf",
                background: "#f0f0f0",
                boxShadow: "0 0 5px white",
              }}
            />
          </div>
        )}
        {isLoading && (
          <div
            style={{
              bottom: 80,
              position: "absolute",
              padding: "10px",
              textAlign: "center",
              width: "100%",
            }}
          >
            <Chip
              icon={<StopCircle fontSize="small" />}
              label="Stop Generating"
              onClick={() => stop()}
              sx={{
                "&:hover": {
                  background: "#dadada",
                },
                border: "1px solid #dfdfdf",
                background: "#f0f0f0",
                boxShadow: "0 0 5px white",
              }}
            />
          </div>
        )}{" "}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Send a message"
            value={input}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={(e) => setMessages([])}
                    edge="start"
                    title="New Chat"
                  >
                    <DeleteForever />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    title="Send Message"
                    onClick={(e) => buttonRef.current?.click()}
                    edge="end"
                    disabled={isLoading || input === ""}
                  >
                    {isLoading ? <CircularProgress size="20px" /> : <Send />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <button ref={buttonRef} style={{ display: "none" }} type="submit">
            Send
          </button>
        </form>
        <div style={{ fontSize: "50%", marginTop: "5px" }}>
          Do not rely on these answers, this is a PRIVATE EXPERIMENT (you should
          know Gadi or Aaron).
        </div>
      </div>
    </>
  );
}
