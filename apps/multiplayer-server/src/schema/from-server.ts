import { z } from "zod";

import { clientGameStateSchema } from "./from-client";
import {
  gameSettingsSchema,
  lobbyStateSchema,
  resultsStateSchema,
  serverAnswerSchema,
  serverQuestionSchema,
  userSchema,
} from "./shared";

export const serverQuestionStateSchema = z.object({
  stage: z.literal("question"),
  question: z.intersection(
    serverQuestionSchema,
    z.object({
      asked: z.coerce.date(),
      questionTime: z.number(),
      qNumber: z.number(),
    }),
  ),
  answers: z.record(z.string(), serverAnswerSchema).default({}),
});
export const serverGameStateSchema = z.discriminatedUnion("stage", [
  lobbyStateSchema,
  resultsStateSchema,
  serverQuestionStateSchema,
]);

export const serverUserJoinSchema = z.object({
  type: z.literal("userJoin"),
  user: userSchema,
  // ...userSchema.shape,
});
export const serverUserLeaveSchema = z.object({
  type: z.literal("userLeave"),
  id: z.string(),
});
export const serverMessageSchema = z.object({
  type: z.literal("message"),
  user: userSchema,
  content: z.string(),
});
export const serverCatchupSchema = z.object({
  type: z.literal("catchup"),
  users: z.record(z.string(), userSchema),
  currentUser: userSchema,
  gameState: clientGameStateSchema,
  gameSettings: gameSettingsSchema,
});
export const serverUpdateUserSchema = z.object({
  type: z.literal("updateUsers"),
  users: z.record(z.string(), userSchema),
});
export const serverUpdateGameStateSchema = z.object({
  type: z.literal("updateGameState"),
  state: clientGameStateSchema,
});
export const serverUpdateGameSettingsSchema = z.object({
  type: z.literal("updateGameSettings"),
  settings: gameSettingsSchema,
});
export const serverToastSchema = z.object({
  type: z.literal("toast"),
  toastType: z.enum(["error", "warn", "info", "success"]).default("info"),
  content: z.string(),
});

export const protocolSchema = z.discriminatedUnion("type", [
  serverUserJoinSchema,
  serverUserLeaveSchema,
  serverCatchupSchema,
  serverUpdateUserSchema,
  serverUpdateGameStateSchema,
  serverUpdateGameSettingsSchema,
  serverToastSchema,
]);
