import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { postLikesPaginated } from "./data";

export const likesRouter = createTRPCRouter({
  postLikesPaginated: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        pageSize: z.number(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { cursor, pageSize, postId } = input;
      const res = await postLikesPaginated({
        postId,
        limit: pageSize,
        offset: cursor ?? 0,
      });
      return res;
    }),
});
