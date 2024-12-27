import type { z } from "zod";
import { ServerWebSocket } from "bun";

import type { protocolSchema } from "@scibo/multiplayer-server/from-client";
import { eq, sql } from "@scibo/db";
import { db } from "@scibo/db/client";
import { Question } from "@scibo/db/schema";

import type { urlParams } from ".";
import {
  serverGameStateSchema,
  serverMessageSchema,
} from "./schema/from-server";
import { questionSchema } from "./schema/shared";
import { channelData } from "./state";
import { publish } from "./utils";

export async function handleIncomingMessage(
  ws: ServerWebSocket<urlParams>,
  currentChannelData: channelData,
  msg: z.infer<typeof protocolSchema>,
) {
  switch (msg.type) {
    case "message": {
      const outgoingMsg: z.infer<typeof serverMessageSchema> = {
        type: "message",
        user: currentChannelData.users[ws.data.userId]!,
        content: msg.content,
      };
      publish(ws.data.room, outgoingMsg);
      currentChannelData.messages.push(outgoingMsg);
      break;
    }

    case "kickUser": {
      if (currentChannelData.users[ws.data.userId]?.role !== "host") return;
      const user = currentChannelData.users[msg.userId];
      if (user && user.role !== "host") {
        user.ws.close(4000, "You have been kicked from the game!");
      }
      break;
    }

    case "startGame": {
      if (currentChannelData.users[ws.data.userId]?.role !== "host") return;
      const firstQuestion = (
        await db
          .select()
          .from(Question)
          .where(eq(Question.valid, true))
          .orderBy(sql`RANDOM()`)
          .limit(1)
      )[0]! as typeof Question.$inferSelect;

      console.log(firstQuestion);

      currentChannelData.gameState = {
        stage: "question",
        question: {
          ...questionSchema.parse(firstQuestion),
          asked: new Date().toISOString(),
          questionTime: 10,
          qNumber: 1,
        },
      };

      const outgoingMsg: z.infer<typeof serverGameStateSchema> = {
        type: "updateGameState",
        state: currentChannelData.gameState,
      };
      publish(ws.data.room, outgoingMsg);
    }
  }
}
