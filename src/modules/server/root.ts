import { createTRPCRouter } from "@/modules/server/trpc";
import { type inferRouterOutputs } from "@trpc/server";
import { postsRouter } from "./posts/router";
import { followsRouter } from "./follows/router";
import { likesRouter } from "./likes/router";
import { notificationsRouter } from "./notifications/router";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  follows: followsRouter,
  likes: likesRouter,
  notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
