import { z } from "zod";

export const SaveUserSchema = z.object({
  username: z
    .string()
    .min(4, {
      message: "Username must be at least 2 characters.",
    })
    .refine(
      (s) => {
        //check string does not have special chars
        return /^[a-zA-Z0-9_]*$/.test(s);
      },
      { message: "Username must not contain special characters." },
    ),
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  country: z.string().optional(),
  bio: z.string().optional(),
  picture: z.string().url().optional(),
});
