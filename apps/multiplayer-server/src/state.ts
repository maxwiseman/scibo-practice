import { ServerWebSocket } from "bun";
import { z } from "zod";

import type { gameSettingsSchema, userSchema } from "./schema/shared";
import { urlParams } from ".";
import { clientGameStateSchema } from "./schema/from-client";
import {
  serverAnswerSchema,
  serverCatchupSchema,
  serverGameStateSchema,
} from "./schema/from-server";
import { serverQuestionSchema } from "./schema/shared";

export const historySchema = z.array(
  z.object({
    question: serverQuestionSchema,
    answers: serverAnswerSchema,
  }),
);

export type channelData = {
  users: Record<
    string,
    z.infer<typeof userSchema> & {
      ws: ServerWebSocket<urlParams>;
    }
  >;
  gameState: z.infer<typeof serverGameStateSchema>;
  gameSettings: z.infer<typeof gameSettingsSchema>;
  history: z.infer<typeof historySchema>;
};

export const storedData: Record<string, channelData> = {};

export function sendCatchup(ws: ServerWebSocket<urlParams>) {
  const currentChannelData = storedData[ws.data.room];
  if (!currentChannelData) {
    ws.close(1011, "Couldn't find room!");
    return;
  }

  const msg: z.infer<typeof serverCatchupSchema> = {
    type: "catchup",
    users: currentChannelData.users,
    currentUser: currentChannelData.users[ws.data.userId]!,
    gameState: clientGameStateSchema.parse(currentChannelData.gameState),
    gameSettings: currentChannelData.gameSettings,
  };

  ws.send(JSON.stringify(serverCatchupSchema.parse(msg)));
}
