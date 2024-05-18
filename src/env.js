import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    REDIS_URL: z.string().url(),
    DB_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string(),
    PUSHER_APP_ID: z.string(),
    PUSHER_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_PUSHER_KEY: z.string(),
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    REDIS_URL: process.env.REDIS_URL,
    DB_URL: process.env.DB_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
