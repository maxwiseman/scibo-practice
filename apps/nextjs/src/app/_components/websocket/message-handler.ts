import type { z } from "zod";

import type { protocolSchema } from "@scibo/multiplayer-server/from-server";
import { serverMessageSchema } from "@scibo/multiplayer-server/from-server";

import type { websocketContext } from "./xstate";

export function handleIncomingMessage(
  ctx: websocketContext,
  msg: z.infer<typeof protocolSchema>,
): Partial<websocketContext> {
  switch (msg.type) {
    case "message": {
      return {
        messageHistory: [...ctx.messageHistory, msg],
      };
    }

    case "userJoin": {
      return {
        users: [...ctx.users, { id: msg.id, username: msg.username }],
      };
    }

    case "userLeave": {
      return {
        users: ctx.users.filter((u) => u.id !== msg.id),
      };
    }

    case "catchup": {
      return {
        users: msg.users,
        messageHistory: msg.messages.map((msgString) =>
          serverMessageSchema.parse(JSON.parse(msgString)),
        ),
      };
    }
  }
}
