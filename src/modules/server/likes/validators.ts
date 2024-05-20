import { z } from "zod";

export const LikeActionSchema = z.object({
  postId: z.string(),
});
