import { z } from "zod";

export const PostAction = z.object({
  postId: z.string(),
});
