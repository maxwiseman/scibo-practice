// websocketStore.js
import type { z } from "zod";
import { createStore } from "@xstate/store";

import type {
  clientGameStateSchema,
  protocolSchema as clientSchema,
} from "@scibo/multiplayer-server/from-client";
import type { serverMessageSchema } from "@scibo/multiplayer-server/from-server";
import type { userSchema } from "@scibo/multiplayer-server/shared";
import { protocolSchema as serverSchema } from "@scibo/multiplayer-server/from-server";
import { toast } from "@scibo/ui/toast";

import { env } from "~/env";
import { handleIncomingMessage } from "./message-handler";

export interface websocketContext {
  currentUser: z.infer<typeof userSchema> | null;
  users: Record<string, z.infer<typeof userSchema>>;
  messageHistory: z.infer<typeof serverMessageSchema>[];
  error: Error | null;
  status: "connecting" | "connected" | "disconnected";
  state: z.infer<typeof clientGameStateSchema>;
  socket: WebSocket | null;
}

const websocketStore = createStore({
  context: {
    currentUser: null,
    users: {},
    messageHistory: [],
    error: null,
    status: "disconnected",
    state: { stage: "lobby" },
    socket: null,
  } as websocketContext,
  on: {
    updateStatus: (context, event: Partial<websocketContext>) => event,
    sendMessage: (
      context,
      event: { message: z.infer<typeof clientSchema> },
    ) => {
      if (context.socket) {
        context.socket.send(JSON.stringify(event.message));
      }
      return {};
    },
    handleMessage: (
      context,
      event: { socket: WebSocket; messageEvent: MessageEvent<string> },
    ) => {
      const parsedMsg = serverSchema.safeParse(
        JSON.parse(event.messageEvent.data),
      );
      if (!parsedMsg.success) {
        toast.error("Invalid message received!");
        console.error(event.messageEvent.data, parsedMsg.error);
        return {};
      }

      return handleIncomingMessage(context, parsedMsg.data);
    },

    // --------------------------------------------------------------------------------------------

    connect: (
      context,
      event: { username: string; userId: string; room: string },
    ) => {
      if (context.status !== "disconnected") return {};

      const ws = new WebSocket(
        env.NEXT_PUBLIC_BACKEND_URL
          ? `wss://${env.NEXT_PUBLIC_BACKEND_URL}/ws?username=${event.username}&userId=${event.userId}&room=${event.room}`
          : `ws://localhost:8080/ws?username=${event.username}&userId=${event.userId}&room=${event.room}`,
      );

      ws.onopen = () => {
        console.log("Connected!");
        websocketStore.send({
          type: "updateStatus",
          currentUser: null,
          users: {},
          messageHistory: [],
          error: null,
          status: "connected",
          state: { stage: "lobby" },
          socket: ws,
        });
      };

      ws.onclose = (event) => {
        websocketStore.send({
          type: "updateStatus",
          socket: null,
          status: "disconnected",
          messageHistory: [],
          users: {},
          error: event.reason ? new Error(event.reason) : null,
        });
        if (event.reason) toast.error(event.reason);
      };

      ws.onmessage = (event: MessageEvent<string>) => {
        websocketStore.send({
          type: "handleMessage",
          socket: ws,
          messageEvent: event,
        });
      };
      return { status: "connecting" } as Partial<websocketContext>;
    },
    disconnect: (context) => {
      websocketStore.send({
        type: "updateStatus",
        ...{
          currentUser: null,
          users: {},
          messageHistory: [],
          error: null,
          status: "disconnected",
          state: { stage: "lobby" },
          socket: null,
        },
      });
      context.socket?.close(1000, "User disconnected");
      return {};
    },
  },
});

export default websocketStore;
