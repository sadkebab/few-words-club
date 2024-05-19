import {
  createTRPCRouter,
  publicProcedure,
  userProcedure,
} from "@/modules/server/api/trpc";
import {
  followedFeedPaginated,
  likeFeedPaginated,
  publicFeedPaginated,
  savedFeedPaginated,
  singlePost,
  userPostsPaginated,
} from "@/modules/server/data/posts";
import { z } from "zod";

export const postsRouter = createTRPCRouter({
  single: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { postId } = input;
      const post = await singlePost(postId);
      return post;
    }),
  forUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        pageSize: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { userId, pageSize, cursor } = input;
      const res = await userPostsPaginated(userId, pageSize, cursor ?? 0);
      return res;
    }),
  publicFeed: publicProcedure
    .input(z.object({ pageSize: z.number(), cursor: z.number().nullish() }))
    .query(async ({ input }) => {
      const { cursor, pageSize } = input;
      const res = await publicFeedPaginated(pageSize, cursor ?? 0);
      return res;
    }),
  followedFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        pageSize: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { cursor, pageSize, userId } = input;
      const res = await followedFeedPaginated(userId, pageSize, cursor ?? 0);
      return res;
    }),
  savedFeed: userProcedure
    .input(
      z.object({
        pageSize: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { cursor, pageSize } = input;
      const res = await savedFeedPaginated(ctx.user.id, pageSize, cursor ?? 0);
      return res;
    }),

  likeFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        pageSize: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { cursor, pageSize, userId } = input;
      const res = await likeFeedPaginated(userId, pageSize, cursor ?? 0);
      return res;
    }),
});
