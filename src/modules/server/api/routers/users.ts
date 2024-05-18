import { createTRPCRouter, publicProcedure } from "@/modules/server/api/trpc";
import { singlePost, userPostsPaginated } from "@/modules/server/data/posts";
import { PostAction } from "../../validators/posts";
import { z } from "zod";

export const postsRouter = createTRPCRouter({
  single: publicProcedure.input(PostAction).query(async ({ input }) => {
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
});
