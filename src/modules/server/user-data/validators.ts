import { z } from "zod";

export const SaveUserSchema = z.object({
  username: z
    .string()
    .min(4, {
      message: "Username must be at least 4 characters.",
    })
    .max(32, {
      message: "Username must be maximum 32 characters",
    })
    .refine(
      (s) => {
        //check string does not have special chars
        return /^[a-zA-Z0-9_]*$/.test(s);
      },
      { message: "Username must not contain special characters." },
    )
    .transform((s) => s.trim()),
  displayName: z
    .string()
    .min(2, {
      message: "Display name must be at least 2 characters.",
    })
    .transform((s) => s.trim()),
  country: z.string().optional(),
  bio: z
    .string()
    .max(200, {
      message: "The bio must be below 200 characters.",
    })
    .optional()
    .transform((s) => (s ? s.trim() : s)),
});

export const UpdateUserDataSchema = z.object({
  displayName: z
    .string()
    .min(2, {
      message: "Display name must be at least 2 characters.",
    })
    .transform((s) => s.trim()),
  country: z.string().optional(),
  bio: z
    .string()
    .max(200, {
      message: "The bio must be below 200 characters.",
    })
    .optional()
    .transform((s) => (s ? s.trim() : s)),
});

export const SaveUserMediaSchema = z.object({
  cover: z.string().optional(),
  picture: z.string(),
});

export const UpdateMediaSchema = z.object({
  source: z.string(),
});
