"use client";
import React from "react";
import NextLink from "next/link";
import MuiLink from "@mui/material/Link";

export default function Link({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <MuiLink component={NextLink} href={href}>
      {children}
    </MuiLink>
  );
}
