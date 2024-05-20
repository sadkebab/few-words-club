import { z } from "zod";

export const SaveActionSchema = z.object({
  postId: z.string(),
});
