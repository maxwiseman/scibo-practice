import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// Define the enum for topics
const TopicEnum = z.enum([
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

// Define the enum for question types
const QuestionTypeEnum = z.enum(["shortAnswer", "multipleChoice"]);

// Define the schema for the answer structure of multiple choice questions
const MultipleChoiceAnswerSchema = z.object({
  answer: z
    .string()
    .describe(
      "The text of the answer. ANY LaTeX MUST BE SURROUNDED BY DOUBLE DOLLAR SIGNS ($$...$$). Use the dollar sign syntax around variables as well, as you would in markdown.",
    ),
  pronunciations: z
    .array(z.string())
    .describe(
      "Any prononciations included in the answer text. Usually surrounded by brackets.",
    ),
  letter: z.string(),
  correct: z
    .boolean()
    .describe(
      "One answer per question must be correct, unless it's multiple select, in which case multiple can be correct.",
    ),
});

// Define the main questionData schema
export const QuestionDataSchema = z.object({
  bonus: z.boolean(),
  number: z.number(),
  topic: TopicEnum,
  type: QuestionTypeEnum,
  pronunciations: z
    .array(z.string())
    .describe(
      "Any prononciations included in the answer text. Usually surrounded by brackets.",
    ),
  question: z
    .string()
    .describe(
      "The text of the question. ANY LaTeX MUST BE SURROUNDED BY DOUBLE DOLLAR SIGNS ($$...$$). Use the dollar sign syntax around variables as well, as you would in markdown.",
    ),
  answer: z.union([
    z
      .string()
      .describe(
        "The answer to a short-answer question. ANY LaTeX MUST BE SURROUNDED BY DOUBLE DOLLAR SIGNS ($$...$$). Use the dollar sign syntax around variables as well, as you would in markdown.",
      ), // For short answer questions
    z
      .array(MultipleChoiceAnswerSchema)
      .describe("The answers to a multiple-choice question."), // For multiple choice questions
  ]),
  explanation: z
    .string()
    .describe(
      "Describe why the correct answer is correct. This isn't given in the source, so you'll have to come up with it on your own.",
    ),
  valid: z
    .boolean()
    .describe(
      "If you believe there is a mistake or error in the question, or that the answer is wrong, mark it as invalid by setting this to false. Otherwise, leave it as true.",
    ),
});

console.log(
  JSON.stringify(
    zodResponseFormat(
      z.object({ questions: z.array(QuestionDataSchema) }),
      "question-parser",
    ).json_schema,
  ),
);
