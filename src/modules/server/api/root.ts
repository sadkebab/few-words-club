import { createTRPCRouter } from "@/modules/server/api/trpc";
import { type inferRouterOutputs } from "@trpc/server";
import { postsRouter } from "./routers/posts";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
