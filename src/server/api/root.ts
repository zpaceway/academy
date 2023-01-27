import { createTRPCRouter } from "./trpc";
import { chaptersRouter } from "./routers/chapters";
import { lessonsRouter } from "./routers/lessons";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  chapters: chaptersRouter,
  lessons: lessonsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
