import type { z } from "zod";

import type { protocolSchema } from "@scibo/multiplayer-server/from-server";
import { toast } from "@scibo/ui/toast";

import type { websocketContext } from "./xstate";

export function handleIncomingMessage(
  ctx: websocketContext,
  msg: z.infer<typeof protocolSchema>,
): Partial<websocketContext> {
  switch (msg.type) {
    case "toast": {
      if (msg.toastType === "info") toast.info(msg.content);
      if (msg.toastType === "error") toast.error(msg.content);
      if (msg.toastType === "warn") toast.warning(msg.content);
      if (msg.toastType === "success") toast.success(msg.content);
      return {};
    }

    case "userJoin": {
      if (ctx.state.stage !== "lobby" && msg.user.role !== "spectator")
        toast.info(`${msg.user.username} has joined!`);
      return {
        users: { ...ctx.users, [msg.user.id]: msg.user },
      };
    }

    case "userLeave": {
      if (ctx.state.stage !== "lobby")
        toast.info(`${ctx.users[msg.id]?.username} has left!`);
      const { [msg.id]: omitted, ...rest } = ctx.users;
      return {
        users: rest,
      };
    }

    case "catchup": {
      return {
        users: msg.users,
        currentUser: msg.currentUser,
        state: msg.gameState,
        settings: msg.gameSettings,
      };
    }

    case "updateUsers": {
      return {
        currentUser: Object.entries(msg.users).find(
          ([uId]) => uId === ctx.currentUser?.id,
        )?.[1],
        users: msg.users,
      };
    }

    case "updateGameState": {
      return {
        state: msg.state,
      };
    }

    case "updateGameSettings": {
      return {
        settings: msg.settings,
      };
    }

    default:
      return {};
  }
}
