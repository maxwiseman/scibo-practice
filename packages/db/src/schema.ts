import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";

export const topicEnum = pgEnum("scibo-topics", [
  "biology",
  "physics",
  "math",
  "earth science",
  "earth and space",
  "energy",
  "general science",
  "astronomy",
  "chemistry",
]);
export const typeEnum = pgEnum("scibo-question-types", [
  "shortAnswer",
  "multipleChoice",
]);

export const question = pgTable("question", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  bonus: boolean("bonus").notNull(),
  number: integer("number").notNull(),
  topic: topicEnum("topic").notNull(),
  type: typeEnum("type").notNull(),
  pronunciations: json("pronunciations").$type<string[]>().notNull(),
  prompt: text("prompt").notNull(),
  htmlUrl: text("html_url").notNull(),
  answer: json("answer")
    .$type<
      | {
          answer: string;
          letter: string;
          correct: boolean;
          pronunciations: string[];
        }[]
      | string
    >()
    .notNull(),
  explanation: text("explanation").notNull(),
  valid: boolean("valid").notNull().default(true),
});
export const questionSelect = createSelectSchema(question, {
  answer: z.union([
    z.string(),
    z.array(
      z.object({
        answer: z.string(),
        letter: z.string(),
        correct: z.boolean(),
        pronunciations: z.array(z.string()),
      }),
    ),
  ]),
});
