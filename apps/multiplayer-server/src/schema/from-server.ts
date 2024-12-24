import { z } from "zod";

import { userSchema } from "./shared";

export const serverUserJoinSchema = z.object({
  type: z.literal("userJoin"),
  id: z.string(),
  username: z.string(),
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
  messages: z.array(z.string()),
});

export const protocolSchema = z.discriminatedUnion("type", [
  serverUserJoinSchema,
  serverUserLeaveSchema,
  serverMessageSchema,
  serverCatchupSchema,
]);
