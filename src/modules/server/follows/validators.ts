import { z } from "zod";

export const FollowActionSchema = z.object({
  userId: z.string(),
});
