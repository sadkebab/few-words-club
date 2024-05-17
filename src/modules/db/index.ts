import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "@/env";

const sql = neon(env.DB_URL);
export const db = drizzle(sql, { schema });
