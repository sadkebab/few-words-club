import { createTRPCRouter } from "@/modules/server/api/trpc";
import { type inferRouterOutputs } from "@trpc/server";
import { postsRouter } from "./routers/posts";
import { followsRouter } from "./routers/follows";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  follows: followsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
