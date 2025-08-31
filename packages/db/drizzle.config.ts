import { env } from "@scibo/auth/env";
import type { Config } from "drizzle-kit";

if (!env.DATABASE_URL || !env.DATABASE_AUTH_TOKEN) {
  throw new Error("Missing database credentials");
}

export default {
  schema: "./src/schema.ts",
  dialect: "turso",
  dbCredentials: { url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN },
  casing: "snake_case",
} satisfies Config;
