import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  userFollowersPaginated,
  userFollowingPaginated,
} from "../../data/follows";

export const followsRouter = createTRPCRouter({
  followersPaginated: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        pageSize: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { cursor, pageSize, userId } = input;
      const res = await userFollowersPaginated({
        userId,
        limit: pageSize,
        offset: cursor ?? 0,
      });
      return res;
    }),
  followingPaginated: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        pageSize: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { cursor, pageSize, userId } = input;
      const res = await userFollowingPaginated({
        userId,
        limit: pageSize,
        offset: cursor ?? 0,
      });
      return res;
    }),
});
