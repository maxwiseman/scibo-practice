import type { z } from "zod";
import { ServerWebSocket } from "bun";

import type { protocolSchema } from "@scibo/multiplayer-server/from-client";

import type { urlParams } from ".";
import { serverMessageSchema } from "./schema/from-server";
import { channelData } from "./state";
import { publish } from "./utils";

export function handleIncomingMessage(
  ws: ServerWebSocket<urlParams>,
  currentChannelData: channelData,
  msg: z.infer<typeof protocolSchema>,
) {
  switch (msg.type) {
    case "message": {
      const outgoingMsg: z.infer<typeof serverMessageSchema> = {
        type: "message",
        user: currentChannelData.users.find((i) => i.id === ws.data.userId)!,
        content: msg.content,
      };
      publish(
        ws.data.room,
        // `${ws.data.username}: ${parsedMsg.data.content}`,
        outgoingMsg,
      );
      currentChannelData.messages.push(outgoingMsg);
      break;
    }

    case "kickUser": {
      if (
        currentChannelData.users.find((i) => i.id === ws.data.userId)?.role !==
        "host"
      )
        return;
      const user = currentChannelData.users.find((i) => i.id === msg.userId);
      if (user && user.role !== "host") {
        user.ws.close(4000, "You have been kicked from the room!");
      }
      break;
    }
  }
}
