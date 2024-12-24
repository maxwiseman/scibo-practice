import { env } from "bun";
import { z } from "zod";

import { protocolSchema } from "./schema/from-client";
import {
  serverMessageSchema,
  serverUserJoinSchema,
  serverUserLeaveSchema,
} from "./schema/from-server";
import { sendCatchup, storedData } from "./state";
import { getSearchParams } from "./utils";

const server = Bun.serve<{ username: string; userId: string; room: string }>({
  port: 8080,
  idleTimeout: 10,

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
    open(ws) {
      if (!storedData[ws.data.room]) {
        storedData[ws.data.room] = { messages: [], users: [] };
      }
      const currentChannelData = storedData[ws.data.room]!;

      server.publish(
        ws.data.room,
        JSON.stringify({
          type: "userJoin",
          id: ws.data.userId,
          username: ws.data.username,
        } as z.infer<typeof serverUserJoinSchema>),
      );
      ws.subscribe(ws.data.room);

      sendCatchup(ws);
      currentChannelData.users.push({
        id: ws.data.userId,
        username: ws.data.username,
      });
    },

    close(ws) {
      const currentChannelData = storedData[ws.data.room];
      if (!currentChannelData) {
        ws.close(1011, "Couldn't find room!");
        return;
      }

      const msg = JSON.stringify({
        type: "userLeave",
        id: ws.data.userId,
      } as z.infer<typeof serverUserLeaveSchema>);
      currentChannelData.users = currentChannelData.users.filter(
        (user) => user.id !== ws.data.userId,
      );
      if (currentChannelData.users.length === 0)
        delete storedData[ws.data.room];
      console.log("Stored data:", storedData);
      ws.unsubscribe(ws.data.room);
      server.publish(ws.data.room, msg);
    },

    message(ws, message) {
      const currentChannelData = storedData[ws.data.room];
      if (!currentChannelData) {
        ws.close(1011, "Couldn't find room!");
        return;
      }

      const parsedMsg = protocolSchema.safeParse(
        JSON.parse(message.toString()),
      );
      if (!parsedMsg.success || parsedMsg.data.type !== "message") {
        console.log(parsedMsg.error);
        console.log(JSON.parse(message.toString()));
        ws.close(1008, `Invalid message: ${parsedMsg.error}`);
        return;
      }

      const outgoingMsg = {
        type: "message",
        user: { id: ws.data.userId, username: ws.data.username },
        content: parsedMsg.data.content,
      } as z.infer<typeof serverMessageSchema>;

      server.publish(
        ws.data.room,
        // `${ws.data.username}: ${parsedMsg.data.content}`,
        JSON.stringify(outgoingMsg),
      );
      currentChannelData.messages.push(JSON.stringify(outgoingMsg));
    },
  },
});

console.log(`Listening on http://${server.hostname}:${server.port}`);
