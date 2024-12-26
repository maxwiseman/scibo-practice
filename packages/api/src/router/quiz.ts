import type { TRPCRouterRecord } from "@trpc/server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

import { sql } from "@scibo/db";
import { Question } from "@scibo/db/schema";

import { publicProcedure } from "../trpc";

export const quizRouter = {
  checkAnswer: publicProcedure
    .input(
      z.object({
        response: z.string(),
        question: z.object({ question: z.string(), answer: z.string() }),
      }),
    )
    .mutation(async ({ input }) => {
      const question = input.question;
      const response = input.response;
      // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
      const data = await generateObject({
        model: openai("gpt-4o-mini"),
        prompt: `Your job is to determine whether or not a participant's answer to a question is correct or not. If they are wrong, give a neutral explanation in 3rd person. THE ANSWER IS CORRECT EVEN IF THEY MADE A SPELLING OR GRAMMAR ERROR! The question information is as follows:
                        Question: ${question.question}
                        Answer: ${JSON.stringify(question.answer)}
                        ---
                        Participant's answer: ${response}`,
        schema: z.object({
          correct: z.boolean(),
          spellingError: z
            .boolean()
            .describe(
              "The response is valid even if there is a spelling error, but if there is one, mark this as true.",
            ),
          // throwOut: z
          //   .boolean()
          //   .describe(
          //     "Some questions may be malformed or otherwise impossible. For example, the question may not give all the neccessary information to complete the task. ONLY IF THAT IS THE CASE, you may set this to true so that the question will not count.",
          //   ),
          explanation: z.string().optional(),
        }),
      });
      return data;
    }),
  getQuestion: publicProcedure
    .input(z.object({ id: z.string() }).optional())
    .query(async ({ ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return (
        await ctx.db.execute(
          sql`select * from ${Question} WHERE ${Question.valid} = TRUE ORDER BY RANDOM() LIMIT 1`,
        )
      ).rows[0]! as typeof Question.$inferSelect;
    }),
} satisfies TRPCRouterRecord;
