import { z } from "zod";

export const PostActionSchema = z.object({
  postId: z.string(),
});

export const CreatePostSchema = z.object({
  content: z.string().min(4),
});

export const EditPostSchema = z.object({
  content: z.string().min(4),
  postId: z.string(),
});
