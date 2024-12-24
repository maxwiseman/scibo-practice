import { z } from "zod";

export const clientMessageSchema = z.object({
  type: z.literal("message"),
  content: z.string(),
});

export const protocolSchema = z.discriminatedUnion("type", [
  clientMessageSchema,
]);
