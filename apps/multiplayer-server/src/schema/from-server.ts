import { z } from "zod";

import { clientGameStateSchema } from "./from-client";
import { lobbyStateSchema, serverQuestionSchema, userSchema } from "./shared";

export const serverAnswerSchema = z.object({
  time: z.date(),
  answer: z.string(),
  correct: z.enum(["incorrect", "correct", "grading"]),
});
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
  messages: z.array(serverMessageSchema),
  currentUser: userSchema,
});
export const serverUpdateUserSchema = z.object({
  type: z.literal("updateUser"),
  user: userSchema,
});
export const serverUpdateGameStateSchema = z.object({
  type: z.literal("updateGameState"),
  state: clientGameStateSchema,
});

export const protocolSchema = z.discriminatedUnion("type", [
  serverUserJoinSchema,
  serverUserLeaveSchema,
  serverMessageSchema,
  serverCatchupSchema,
  serverUpdateUserSchema,
  serverUpdateGameStateSchema,
]);
