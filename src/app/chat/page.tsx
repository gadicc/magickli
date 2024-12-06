"use client";
import React from "react";
import { Message, useChat } from "ai/react";
import Image from "next/image";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeAddClasses from "rehype-add-classes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ToastContainer, toast } from "react-toastify";
import { Document as LangChainDocument } from "@langchain/core/documents";

import { UserAvatar } from "../MyAppBar";
import type { ChatMessageMetaData } from "./api/route";
import AndroidMagicianAvatar from "@/app/img/android-magician-avatar.png";

import {
  Autorenew,
  DeleteForever,
  Person,
  Send,
  StopCircle,
} from "@mui/icons-material";

import {
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

const remarkPlugins = [remarkGfm];
const rehypePlugins = [[rehypeAddClasses, { table: "rehype-table" }]];

function metaMessage(message: Message) {
  const parts = message.content.split("\n__META_JSON__\n");
  return {
    ...message,
    meta: parts[2] ? (JSON.parse(parts[1]) as ChatMessageMetaData) : null,
    content: parts[2] || parts[0],
  };
}

export default function Chat() {
  const ref = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [sourcesForMessages, setSourcesForMessages] = React.useState<
    Record<string, LangChainDocument[]>
  >({});

  const {
    messages: _messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
    stop,
  } = useChat({
    api: "/chat/api",
    onError: (e) => {
      toast(e.message, {
        theme: "dark",
      });
    },
  });
  // console.log({ messages, input, isLoading, sourcesForMessages });
  const autoscroll = React.useRef(true);

  const messages =
    _messages.length > 0
      ? _messages
      : ([
          {
            id: "START",
            createdAt: new Date(),
            content:
              "Hi, I'm your friendly Magician's Assistant.  Ask me anything " +
              "about Magick, but please remember that I'm not perfect and " +
              "can make mistakes.",
            role: "assistant",
          },
        ] as Message[]);

  console.log({ messages });

  React.useEffect(() => {
    if (autoscroll.current) window.scrollTo(0, document.body.scrollHeight);
    // ref.current?.scrollIntoViewIfNeeded();
    // console.log({ messages });
  }, [messages]);

  React.useEffect(() => {
    function checkScroll() {
      const el = document.documentElement;
      const atBottom = el.scrollHeight - el.clientHeight - el.scrollTop < 1;
      if (atBottom) autoscroll.current = true;
      else autoscroll.current = false;
    }
    const func = (...args) => console.log(args);
    document.addEventListener("scrollend", checkScroll);
    return () => document.removeEventListener("scrollend", checkScroll);
  }, []);

  return (
    <>
      <div id="messages">
        {messages.map(metaMessage).map((m) => {
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                padding: "2px 15px 2px 15px",
                backgroundColor: m.role === "assistant" ? "#f7f7f7" : "",
                borderTop: m.role === "assistant" ? "1px solid #ccc" : "",
                borderBottom: m.role === "assistant" ? "1px solid #ccc" : "",
                overflowX: "auto",
              }}
            >
              <div style={{ width: "50px", marginTop: "19px" }}>
                {m.role === "user" ? (
                  <UserAvatar
                    sx={{ width: 32, height: 32, border: "1px solid #888" }}
                  />
                ) : (
                  <Avatar
                    sx={{ width: 32, height: 32, border: "1px solid #888" }}
                  >
                    <Image src={AndroidMagicianAvatar} fill alt="Assistant" />
                  </Avatar>
                )}
              </div>
              <style>{`
              .ai_content table {
                margin-top: 1em;
                margin-bottom: 1em;
                border-spacing: 0;
                border-collapse: collapse;
              }
              .ai_content table tr {
                background-color: #fff;
                border-top: 1px solid #c6cbd1;
              }
              .ai_content table tbody tr:nth-child(odd) {
                background-color: #f6f8fa;
              }
              .ai_content table th,
              .ai_content table td {
                padding: 6px 13px;
                border: 1px solid #dfe2e5;
              }
              .ai_content table th {
                font-weight: 600;
              }
              .ai_content li {
                font-size: 90%;
              }
              .ai_content li + li {
                margin-top: 1em;
              }
            `}</style>
              <div
                className="ai_content"
                style={{ width: "50px", flexGrow: 1 }}
              >
                <ReactMarkdown
                  linkTarget="_blank"
                  remarkPlugins={remarkPlugins}
                  // @ts-expect-error: its fine
                  rehypePlugins={rehypePlugins}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          style={dark}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {m.content}
                </ReactMarkdown>
                {m.meta?.sources ? (
                  <details>
                    <summary>Sources</summary>
                    <ol>
                      {m.meta.sources.map((source, i) => (
                        <li key={i}>
                          <details>
                            <summary>
                              {" "}
                              <i>
                                {source.metadata["pdf.info.Title"] ||
                                  // @ts-expect-error: ok for now
                                  source.metadata.pdf?.info?.Title}
                              </i>
                              ,{" "}
                              {source.metadata["pdf.info.Author"] ||
                                // @ts-expect-error: ok for now
                                source.metadata.pdf?.info?.Author}
                              , page{" "}
                              {source.metadata["loc.pageNumber"] ||
                                // @ts-expect-error: ok for now
                                source.metadata.loc?.pageNumber}
                              .
                            </summary>
                            <p style={{ fontSize: "75%" }}>
                              {source.pageContent}
                            </p>
                          </details>
                        </li>
                      ))}
                    </ol>
                  </details>
                ) : null}
              </div>
            </div>
          );
        })}
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
        <form
          onSubmit={(e) => {
            autoscroll.current = true;
            handleSubmit(e);
          }}
        >
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
      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
      />
    </>
  );
}
