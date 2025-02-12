import { z } from "zod";

import { topicEnum } from "@scibo/db/types";

// import { serverAnswerSchema } from "./from-server";

// import { historySchema } from "../state";

export const userPlayerSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: z.enum(["player", "host"]).default("player"),
  score: z.number().default(0),
});

export const userSpectatorSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  role: z.literal("spectator"),
});

export const userSchema = z.discriminatedUnion("role", [
  userPlayerSchema,
  userSpectatorSchema,
]);
export const serverAnswerSchema = z.object({
  time: z.coerce.date(),
  answer: z.string(),
  correct: z.enum(["incorrect", "correct", "skipped", "grading"]),
});

export const serverMcqAnswerSchema = z.object({
  answer: z.coerce.string(),
  letter: z.string(),
  correct: z.boolean(),
  pronunciations: z.array(z.string()),
});
export const serverMcqQuestionSchema = z.object({
  bonus: z.boolean(),
  number: z.number(),
  topic: topicEnum,
  type: z.literal("multipleChoice"),
  question: z.string(),
  pronunciations: z.array(z.string()),
  answer: z.array(serverMcqAnswerSchema),
  htmlUrl: z.string(),
  explanation: z.string(),
  valid: z.boolean(),
});
export const serverSaqQuestionSchema = z.object({
  bonus: z.boolean(),
  number: z.number(),
  topic: topicEnum,
  type: z.literal("shortAnswer"),
  question: z.string(),
  pronunciations: z.array(z.string()),
  answer: z.coerce.string(),
  htmlUrl: z.string(),
  explanation: z.string(),
  valid: z.boolean(),
});

export const clientMcqAnswerSchema = z.object({
  answer: z.coerce.string(),
  letter: z.string(),
  // correct: z.boolean().optional(),
  pronunciations: z.array(z.string()),
});
export const clientMcqQuestionSchema = z.object({
  bonus: z.boolean(),
  number: z.number(),
  topic: topicEnum,
  type: z.literal("multipleChoice"),
  question: z.string(),
  pronunciations: z.array(z.string()),
  answer: z.array(clientMcqAnswerSchema),
  // htmlUrl: z.string(),
  // explanation: z.string(),
  valid: z.boolean(),
});
export const clientSaqQuestionSchema = z.object({
  bonus: z.boolean(),
  number: z.number(),
  topic: topicEnum,
  type: z.literal("shortAnswer"),
  question: z.string(),
  pronunciations: z.array(z.string()),
  // answer: z.coerce.string().optional(),
  // htmlUrl: z.string(),
  // explanation: z.string(),
  valid: z.boolean(),
});
export const serverQuestionSchema = z.discriminatedUnion("type", [
  serverSaqQuestionSchema,
  serverMcqQuestionSchema,
]);
export const clientQuestionSchema = z.discriminatedUnion("type", [
  clientSaqQuestionSchema,
  clientMcqQuestionSchema,
]);

export const historySchema = z.array(
  z.object({
    question: serverQuestionSchema,
    answers: z.record(z.string(), serverAnswerSchema),
  }),
);

export const gameStages = z.enum(["lobby", "question", "results"]);
export const lobbyStateSchema = z.object({ stage: z.literal("lobby") });
export const resultsStateSchema = z.object({
  stage: z.literal("results"),
  history: historySchema,
});

export const gameSettingsSchema = z.object({
  timing: z
    .object({
      enabled: z.boolean().default(true),
      time: z.number().default(7),
      bonusTime: z.number().default(22),
      overtime: z.boolean().default(false),
      maxOvertime: z.number().default(10),
    })
    .default({}),
  scoring: z
    .object({
      correct: z.number().default(4),
      bonus: z.number().default(10),
      overtimeDecrement: z.number().default(0.25),
    })
    .default({}),
  general: z
    .object({
      maxPlayers: z.number().default(8),
    })
    .default({}),
  end: z
    .discriminatedUnion("type", [
      z.object({ type: z.literal("time"), maxTime: z.number().default(10) }),
      z.object({
        type: z.literal("questions"),
        maxQuestions: z.number().default(20),
      }),
    ])
    .default({ type: "questions" }),
});
