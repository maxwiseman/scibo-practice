import { env } from "bun";
import { z } from "zod";

import { handleIncomingMessage } from "./message-handler";
import { protocolSchema } from "./schema/from-client";
import {
  serverMessageSchema,
  serverUserJoinSchema,
  serverUserLeaveSchema,
} from "./schema/from-server";
import { userSchema } from "./schema/shared";
import { sendCatchup, storedData } from "./state";
import { force, getSearchParams, publish } from "./utils";

export type urlParams = {
  username: string;
  userId: string;
  room: string;
};
export const server = Bun.serve<urlParams>({
  port: 8080,

  async fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/chat") {
      console.log(`Upgrading connection!`);
      const success = server.upgrade(req, {
        data: getSearchParams(req.url),
      });
      return success
        ? undefined
        : new Response("WebSocket upgrade error", { status: 400 });
    }

    return new Response(
      (await Bun.file("./src/index.html").text()).replaceAll(
        "ws://localhost:8080",
        env.NEXT_PUBLIC_BACKEND_URL
          ? `wss://${env.NEXT_PUBLIC_BACKEND_URL}`
          : "ws://localhost:8080",
      ),
      { headers: { "Content-Type": "text/html" } },
    );
  },

  websocket: {
    idleTimeout: 240,
    open(ws) {
      let newRoom = false;
      if (!storedData[ws.data.room]) {
        storedData[ws.data.room] = {
          messages: [],
          users: [],
          gameState: { stage: "lobby" },
        };
        newRoom = true;
      }
      const currentChannelData = storedData[ws.data.room]!;

      if (
        currentChannelData.users.find((i) => i.id === ws.data.userId) !==
        undefined
      ) {
        ws.close(3000, "That user ID already exists in this game.");
        return;
      }

      const userData: z.infer<typeof userSchema> = {
        id: ws.data.userId,
        username: ws.data.username,
        role: newRoom ? "host" : "player",
      };

      publish<z.infer<typeof serverUserJoinSchema>>(ws.data.room, {
        type: "userJoin",
        user: userData,
      });
      ws.subscribe(ws.data.room);

      currentChannelData.users.push({ ...userData, ws });
      sendCatchup(ws);
    },

    close(ws, code, reason) {
      console.log("Connection closed!", code, reason);

      const currentChannelData = storedData[ws.data.room];
      if (!currentChannelData) {
        return;
      }
      if (code === 3000) return;

      let wasHost = false;
      if (
        currentChannelData.users.find((user) => user.id === ws.data.userId)
          ?.role === "host"
      )
        wasHost = true;
      currentChannelData.users = currentChannelData.users.filter(
        (user) => user.id !== ws.data.userId,
      );
      if (currentChannelData.users.length === 0)
        delete storedData[ws.data.room];
      else if (wasHost) {
        currentChannelData.users[0]!.role = "host";
        publish(ws.data.room, {
          type: "updateUser",
          user: currentChannelData.users[0]!,
        });
      }

      ws.unsubscribe(ws.data.room);
      publish(ws.data.room, {
        type: "userLeave",
        id: ws.data.userId,
      });
    },

    message(ws, message) {
      const currentChannelData = storedData[ws.data.room];
      if (!currentChannelData) {
        console.error("Closing connection, couldn't find room");
        ws.close(1011, "Couldn't find room!");
        return;
      }

      const parsedMsg = protocolSchema.safeParse(
        JSON.parse(message.toString()),
      );
      if (!parsedMsg.success) {
        console.log(parsedMsg.error);
        console.error("Closing connection, invalid message");
        ws.close(1008, `Invalid message: ${parsedMsg.error}`);
        return;
      }

      handleIncomingMessage(ws, currentChannelData, parsedMsg.data);
    },
  },
});

console.log(`Listening on http://${server.hostname}:${server.port}`);
