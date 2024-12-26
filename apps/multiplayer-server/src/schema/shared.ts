import { z } from "zod";

import { question, topicEnum, typeEnum } from "@scibo/db/types";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: z.enum(["player", "spectator", "host"]).default("player"),
});

export const mcqQuestionSchema = z.object({
  bonus: z.boolean(),
  number: z.number(),
  topic: topicEnum,
  type: z.literal("multipleChoice"),
  question: z.string(),
  answer: z.array(
    z.object({
      answer: z.string(),
      letter: z.string(),
      correct: z.boolean(),
    }),
  ),
  htmlUrl: z.string(),
  originalText: z.string(),
});
export const saqQuestionSchema = z.object({
  bonus: z.boolean(),
  number: z.number(),
  topic: topicEnum,
  type: z.literal("shortAnswer"),
  question: z.string(),
  answer: z.string(),
  htmlUrl: z.string(),
  originalText: z.string(),
});
export const questionSchema = z.discriminatedUnion("type", [
  saqQuestionSchema,
  mcqQuestionSchema,
]);

export const gameStages = z.enum(["lobby", "question"]);
export const lobbyStateSchema = z.object({ stage: z.literal("lobby") });
export const questionStateSchema = z.object({
  stage: z.literal("question"),
  question: z.intersection(
    questionSchema,
    z.object({ asked: z.string().datetime(), questionTime: z.number() }),
  ),
});
export const gameStateSchema = z.discriminatedUnion("stage", [
  lobbyStateSchema,
  questionStateSchema,
]);

export const gameSettingsSchema = z.object({
  timing: z.object({
    enabled: z.boolean().default(true),
    time: z.number().default(7),
    bonusTime: z.number().default(22),
    overtime: z.boolean().default(false),
    maxOvertime: z.number().default(10),
  }),
  scoring: z.object({
    correct: z.number().default(4),
    bonus: z.number().default(10),
    overtimeDecrement: z.number().default(0.25),
  }),
  general: z.object({
    maxPlayers: z.number().default(8),
  }),
  end: z.discriminatedUnion("type", [
    z.object({ type: z.literal("time"), maxTime: z.number().default(10) }),
    z.object({
      type: z.literal("questions"),
      maxQuestions: z.number().default(20),
    }),
  ]),
});
