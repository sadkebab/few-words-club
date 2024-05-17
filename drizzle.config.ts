import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/modules/db/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});
