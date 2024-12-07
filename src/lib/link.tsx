"use client";
import React from "react";
import NextLink from "next/link";
import MuiLink from "@mui/material/Link";

export default function Link({
  href,
  children,
  underline,
}: {
  href: string;
  children: React.ReactNode;
  underline?: "none" | "hover" | "always";
}) {
  return (
    <MuiLink component={NextLink} href={href} underline={underline}>
      {children}
    </MuiLink>
  );
}
