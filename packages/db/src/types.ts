import { z } from "zod";

export const topicEnum = z.enum([
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
export const typeEnum = z.enum(["shortAnswer", "multipleChoice"]);
export const question = z.object({
  bonus: z.boolean(),
  number: z.number(),
  topic: topicEnum,
  type: typeEnum,
  question: z.string(),
  // { answer: string; letter: string; correct: boolean }[] | string
  answer: z.array(
    z.object({ answer: z.string(), letter: z.string(), correct: z.boolean() }),
  ),
  htmlUrl: z.string(),
  originalText: z.string(),
});
