import type { OpenAI } from "openai";
import { z } from "zod";

import { db } from "@scibo/db/client";
import { Question } from "@scibo/db/schema";

import { QuestionDataSchema } from "./format";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schema = z.object({ questions: z.array(QuestionDataSchema) });

let questionCount = 0;
let invalidQuestionCount = 0;
let questions: (z.infer<typeof QuestionDataSchema> & { htmlUrl: string })[] =
  [];

await db.delete(Question);

function parseBatch(text: string) {
  const lines = text.split("\n");

  lines.forEach((line) => {
    if (line.length === 0) return;
    const lineJson = JSON.parse(line) as {
      id: string;
      custom_id: string;
      errors: string[];
      response: {
        status_code: number;
        request_id: string;
        body: OpenAI.Chat.Completions.ChatCompletion;
        usage: {
          prompt_tokens: number;
          completion_tokens: number;
          total_tokens: number;
          prompt_tokens_details: {
            cached_tokens: number;
            audio_tokens: number;
          };
          completion_tokens_details: {
            reasoning_tokens: number;
            audio_tokens: number;
            accepted_prediction_tokens: number;
            rejected_prediction_tokens: number;
          };
          system_fingerprint: string;
        };
      };
    };
    if (typeof lineJson.response.body.choices[0]?.message.content !== "string")
      return;
    try {
      const messageContent = JSON.parse(
        lineJson.response.body.choices[0].message.content,
      ) as z.infer<typeof schema>;

      if (messageContent.questions[0]?.valid === true) {
        console.log(messageContent);
        questionCount++;
      } else {
        invalidQuestionCount++;
      }

      questions = questions.concat(
        messageContent.questions.map((q) => ({
          ...q,
          question:
            q.type === "shortAnswer"
              ? q.question
              : q.question.replace(/\b([WXYZ])\)\s.*/, "").trim(),
          htmlUrl: `${lineJson.custom_id.split("-=-")[0]}#page=${parseInt(lineJson.custom_id.split("-=-")[1] ?? "") + 1}`,
        })),
      );
    } catch {
      return;
    }
  });
}

for (let i = 0; i < 11; i++) {
  const file = Bun.file(`./batch-outputs/${i}.jsonl`);
  const exists = await file.exists();
  if (!exists) {
    console.log("No more batches to process");
    break;
  }
  const text = await file.text();
  parseBatch(text);
}

console.log(questions.length);

const promises = splitArray(questions, 100).map(async (qList) => {
  await db
    .insert(Question)
    .values(qList)
    .then(() => {
      console.log("Inserted 100 questions");
    });
});

await Promise.all(promises);

console.log(`Valid questions: ${questionCount}`);
console.log(`Invalid questions: ${invalidQuestionCount}`);

function splitArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}
