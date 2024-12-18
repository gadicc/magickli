"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import workboxStuff from "@/workboxStuff";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    workboxStuff();
  }, []);

  return (
    <SessionProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </SessionProvider>
  );
}
