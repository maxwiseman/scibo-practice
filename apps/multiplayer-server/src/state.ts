import { ServerWebSocket } from "bun";
import { z } from "zod";

import type { gameStateSchema, userSchema } from "./schema/shared";
import { urlParams } from ".";
import { serverCatchupSchema, serverMessageSchema } from "./schema/from-server";

export type channelData = {
  users: Record<
    string,
    z.infer<typeof userSchema> & {
      ws: ServerWebSocket<urlParams>;
    }
  >;
  messages: z.infer<typeof serverMessageSchema>[];
  gameState: z.infer<typeof gameStateSchema>;
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
    messages: currentChannelData.messages,
    currentUser: currentChannelData.users[ws.data.userId]!,
  };

  ws.send(JSON.stringify(msg));
}
