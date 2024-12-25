import type { z } from "zod";

import type { protocolSchema } from "@scibo/multiplayer-server/from-server";

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
        users: [...ctx.users, msg.user],
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
        messageHistory: msg.messages,
        currentUser: msg.currentUser,
      };
    }

    case "updateUser": {
      return {
        currentUser:
          msg.user.id === ctx.currentUser?.id ? msg.user : ctx.currentUser,
        users: ctx.users.map((u) => (u.id === msg.user.id ? msg.user : u)),
      };
    }
    default:
      return {};
  }
}
