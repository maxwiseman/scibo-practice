import { env } from "bun";

import { sendCatchup } from "./state";
import { getSearchParams } from "./utils";

type channelData = {
  users: {
    id?: string;
    username: string;
  }[];
  messages: string[];
};

export const storedData: Record<string, channelData> = {};

const server = Bun.serve<{ username: string; room: string }>({
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
        "localhost:8080",
        env.BACKEND_URL ?? "localhost:8080",
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

      server.publish(ws.data.room, `${ws.data.username} has entered the chat`);
      ws.subscribe(ws.data.room);

      sendCatchup(ws);
      currentChannelData.users.push({ username: ws.data.username });
    },

    message(ws, message) {
      const currentChannelData = storedData[ws.data.room];
      if (!currentChannelData) {
        ws.close(1011, "Couldn't find room!");
        return;
      }

      server.publish(ws.data.room, `${ws.data.username}: ${message}`);
      console.log("Stored data:", currentChannelData);
      currentChannelData.messages.push(`${ws.data.username}: ${message}`);
    },

    close(ws) {
      const currentChannelData = storedData[ws.data.room];
      if (!currentChannelData) {
        ws.close(1011, "Couldn't find room!");
        return;
      }

      const msg = `${ws.data.username} has left the chat`;
      currentChannelData.users = currentChannelData.users.filter(
        (user) => user.username !== ws.data.username,
      );
      if (currentChannelData.users.length === 0)
        delete storedData[ws.data.room];
      console.log("Stored data:", storedData);
      ws.unsubscribe(ws.data.room);
      server.publish(ws.data.room, msg);
    },
  },
});

console.log(`Listening on http://${server.hostname}:${server.port}`);
