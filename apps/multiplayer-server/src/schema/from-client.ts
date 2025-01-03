import { z } from "zod";

import {
  clientQuestionSchema,
  gameSettingsSchema,
  lobbyStateSchema,
} from "./shared";

export const clientQuestionStateSchema = z.object({
  stage: z.literal("question"),
  question: z.intersection(
    clientQuestionSchema,
    z.object({
      asked: z.coerce.date(),
      questionTime: z.number(),
      qNumber: z.number(),
    }),
  ),
  correctAnswer: z.string().optional(),
  answers: z
    .record(
      z.string(),
      z.object({
        time: z.coerce.date(),
        answer: z.string(),
        correct: z.enum(["correct", "incorrect", "skipped", "grading"]),
      }),
    )
    .optional(),
});
export const clientGameStateSchema = z.discriminatedUnion("stage", [
  lobbyStateSchema,
  clientQuestionStateSchema,
]);

export const clientKickSchema = z.object({
  type: z.literal("kickUser"),
  userId: z.string(),
});
export const clientStartGameSchema = z.object({
  type: z.literal("startGame"),
});
export const clientAnswerQuestionSchema = z.object({
  type: z.literal("answerQuestion"),
  answer: z.string(),
});
export const clientUpdateGameSettingsSchema = z.object({
  type: z.literal("updateGameSettings"),
  settings: gameSettingsSchema,
});

export const protocolSchema = z.discriminatedUnion("type", [
  clientKickSchema,
  clientStartGameSchema,
  clientAnswerQuestionSchema,
  clientUpdateGameSettingsSchema,
]);
