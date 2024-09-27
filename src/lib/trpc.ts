"use client";
import { createTRPCClient, unstable_httpBatchStreamLink } from "@trpc/client";
import type { AppRouter } from "@/app/api/trpc/appRouter";
//     👆 **type-only** import
import superjson from "superjson";

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
const trpc = createTRPCClient<AppRouter>({
  links: [
    unstable_httpBatchStreamLink({
      // url: "http://localhost:3000",
      url: window.location.origin + "/api/trpc",
      transformer: superjson,
    }),
  ],
});

export default trpc;
