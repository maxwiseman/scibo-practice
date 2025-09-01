import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});
