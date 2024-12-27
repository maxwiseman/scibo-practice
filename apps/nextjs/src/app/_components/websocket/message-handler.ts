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
        users: { ...ctx.users, [msg.user.id]: msg.user },
      };
    }

    case "userLeave": {
      const { [msg.id]: omitted, ...rest } = ctx.users;
      return {
        users: rest,
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
        users: { ...ctx.users, [msg.user.id]: msg.user },
      };
    }

    case "updateGameState": {
      return {
        state: msg.state,
      };
    }

    default:
      return {};
  }
}
