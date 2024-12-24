import { ServerWebSocket } from "bun";
import { z } from "zod";

import type { userSchema } from "./schema/shared";
import { serverCatchupSchema } from "./schema/from-server";

type channelData = {
  users: z.infer<typeof userSchema>[];
  messages: string[];
};

export const storedData: Record<string, channelData> = {};

export function sendCatchup(
  ws: ServerWebSocket<{
    username: string;
    room: string;
  }>,
) {
  const currentChannelData = storedData[ws.data.room];
  if (!currentChannelData) {
    ws.close(1011, "Couldn't find room!");
    return;
  }

  // ws.send(
  //   `${currentChannelData.users.length > 0 ? currentChannelData?.users.map((i) => i.username).join(", ") : "Nobody"} is here`,
  // );
  ws.send(
    JSON.stringify({
      type: "catchup",
      users: currentChannelData.users,
      messages: currentChannelData.messages,
    } as z.infer<typeof serverCatchupSchema>),
  );
  // currentChannelData?.messages.forEach((msg) => {
  //   ws.send(msg);
  // });
}
