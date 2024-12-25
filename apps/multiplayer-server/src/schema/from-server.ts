import { z } from "zod";

import { gameStateSchema, userSchema } from "./shared";

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
  users: z.array(userSchema),
  messages: z.array(serverMessageSchema),
  currentUser: userSchema,
});
export const serverUpdateUserSchema = z.object({
  type: z.literal("updateUser"),
  user: userSchema,
});
export const serverGameSettingsSchema = z.object({
  type: z.literal("gameSettings"),
  gameState: gameStateSchema,
});

export const protocolSchema = z.discriminatedUnion("type", [
  serverUserJoinSchema,
  serverUserLeaveSchema,
  serverMessageSchema,
  serverCatchupSchema,
  serverUpdateUserSchema,
  serverGameSettingsSchema,
]);
