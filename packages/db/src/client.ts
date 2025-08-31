import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import * as schema from "./schema";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error("Missing database credentials");
}

const client = createClient({ url, authToken });

export const db = drizzle(client, { schema });
