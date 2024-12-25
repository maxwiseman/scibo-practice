import { z } from "zod";

import { gameStages } from "./shared";

export const clientMessageSchema = z.object({
  type: z.literal("message"),
  content: z.string(),
});
export const clientKickSchema = z.object({
  type: z.literal("kickUser"),
  userId: z.string(),
});
export const clientGameSettingsSchema = z.object({
  type: z.literal("gameSettings"),
  stage: gameStages,
});

export const protocolSchema = z.discriminatedUnion("type", [
  clientMessageSchema,
  clientKickSchema,
  clientGameSettingsSchema,
]);
