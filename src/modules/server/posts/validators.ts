import { z } from "zod";

export const PostActionSchema = z.object({
  postId: z.string(),
});

export const CreatePostSchema = z.object({
  content: z
    .string()
    .min(4, {
      message: "The content must be between 4 and 300 characters.",
    })
    .max(300, {
      message: "The content must be between 4 and 300 characters.",
    }),
});

export const EditPostSchema = z.object({
  content: z.string().min(4),
  postId: z.string(),
});
