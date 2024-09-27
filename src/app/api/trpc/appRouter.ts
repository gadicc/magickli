import { router } from "./trpc";
import * as queries from "./queries";
import * as mutations from "./mutations";

// GADI adds export
export const appRouter = router({
  ...mutations,
  ...queries,
});

// Export type router type signature,
// NOT the router itself.
// GADI - why?  no problem to import type only
export type AppRouter = typeof appRouter;
