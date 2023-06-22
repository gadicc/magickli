"use client";
import React from "react";
import { Message, useChat } from "ai/react";
import ReactMarkdown from "react-markdown";

import { ExpandMore, HourglassTop, Person, Send } from "@mui/icons-material";

import AppBar from "../components/AppBar";
import Admin from "./admin";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
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
                <img src="/pentagram.png" width="32px" height="32px" />
              )}
            </div>
            <div style={{ width: "50px", flexGrow: 1 }}>
              <ReactMarkdown linkTarget="_blank">{m.content}</ReactMarkdown>
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
                              {/* <b>Source:</b>{" "} */}
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
            </div>
          </div>
        ))}
      </div>
      <div ref={ref}></div>
      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: "15px 10px 10px 10px",
          width: "100%",
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 12px)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Send a message"
            value={input}
            onChange={handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
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
