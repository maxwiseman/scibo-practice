import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { ServerWebSocket } from "bun";
import { z } from "zod";

import { eq, sql } from "@scibo/db";
import { db } from "@scibo/db/client";
import { Question } from "@scibo/db/schema";
import {
  clientGameStateSchema,
  protocolSchema,
} from "@scibo/multiplayer-server/from-client";

import type { urlParams } from ".";
import {
  serverAnswerSchema,
  serverMessageSchema,
  protocolSchema as serverProtocolSchema,
  serverUpdateGameStateSchema,
} from "./schema/from-server";
import { clientQuestionSchema, serverQuestionSchema } from "./schema/shared";
import { channelData } from "./state";
import { publish } from "./utils";

export async function handleIncomingMessage(
  ws: ServerWebSocket<urlParams>,
  currentChannelData: channelData,
  msg: z.infer<typeof protocolSchema>,
) {
  switch (msg.type) {
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

      publish(ws.data.room, await nextQuestion(currentChannelData));
      break;
    }

    case "answerQuestion": {
      if (currentChannelData.gameState.stage !== "question") return;
      function handleAllAnswers(
        currentUserAnswer: z.infer<typeof serverAnswerSchema>,
      ) {
        if (currentChannelData.gameState.stage !== "question") return;

        currentChannelData.gameState.answers[ws.data.userId] =
          currentUserAnswer;

        Object.keys(currentChannelData.gameState.answers).forEach((uId) => {
          const outgoingMsg: z.infer<typeof serverUpdateGameStateSchema> = {
            type: "updateGameState",
            state: currentChannelData.gameState,
          };
          currentChannelData.users[uId]?.ws.send(JSON.stringify(outgoingMsg));
        });

        if (
          Object.values(currentChannelData.users).length ===
          Object.values(currentChannelData.gameState.answers).length &&
          !Object.values(currentChannelData.gameState.answers)
            .map((a) => a.correct)
            .includes("grading")
        ) {
          console.log(
            "Everyone has answered!",
            currentChannelData.gameState.answers,
          );
          currentChannelData.users = Object.fromEntries(
            Object.entries(currentChannelData.users).map(([uId, userData]) => {
              if (
                currentChannelData.gameState.stage !== "question" ||
                (userData.role !== "host" && userData.role !== "player")
              )
                return [uId, userData];
              const userAnswer = currentChannelData.gameState.answers[uId];
              const question = currentChannelData.gameState.question;
              const settings = currentChannelData.gameSettings;
              return [
                uId,
                {
                  ...userData,
                  score:
                    userAnswer?.correct === "correct"
                      ? userData.score +
                      (question.bonus
                        ? settings.scoring.bonus
                        : settings.scoring.correct)
                      : userData.score,
                },
              ];
            }),
          );
          Object.keys(currentChannelData.gameState.answers).forEach((uId) => {
            const outgoingMsg: z.infer<typeof serverProtocolSchema> = {
              type: "updateUsers",
              users: currentChannelData.users,
            };
            currentChannelData.users[uId]?.ws.send(JSON.stringify(outgoingMsg));
          });
          setTimeout(async () => {
            publish(ws.data.room, await nextQuestion(currentChannelData));
          }, 10000);
          return;
        }
      }

      const answerTime = new Date();
      const question = currentChannelData.gameState.question;
      const response = msg.answer;

      if (msg.answer === "") {
        handleAllAnswers({
          correct: "skipped",
          time: answerTime,
          answer: msg.answer,
        });
        return;
      }

      if (question.type === "multipleChoice") {
        const correctAnswer = question.answer.find((i) => i.correct);
        if (msg.answer.toLowerCase() === correctAnswer?.letter.toLowerCase()) {
          // send back true
          handleAllAnswers({
            correct: "correct",
            time: answerTime,
            answer: msg.answer,
          });
          return;
        } else {
          // send back false
          handleAllAnswers({
            correct: "incorrect",
            time: answerTime,
            answer: msg.answer,
          });
          return;
        }
      }

      if (msg.answer.toLowerCase().includes(question.answer.toLowerCase())) {
        // send back true
        handleAllAnswers({
          correct: "correct",
          time: answerTime,
          answer: msg.answer,
        });
        return;
      }
      handleAllAnswers({
        correct: "grading",
        time: answerTime,
        answer: msg.answer,
      });
      const data = await generateObject({
        model: openai("gpt-4o-mini", { structuredOutputs: true }),
        prompt: `Your job is to determine whether or not a participant's answer to a question is correct or not. If they are wrong, give a SHORT, neutral explanation as if you are talking to the participant. THE ANSWER IS CORRECT EVEN IF THEY MADE A SPELLING OR GRAMMAR ERROR! The question information is as follows:
                        Question: ${question.question}
                        Correct Answer: ${question.answer}
                        ---
                        Participant's answer: ${response}`,
        schema: z.object({
          correct: z.boolean(),
          spellingError: z
            .boolean()
            .describe(
              "The response is valid even if there is a spelling error, but if there is one, mark this as true.",
            ),
          explanation: z.string().nullable(),
        }),
      });
      handleAllAnswers({
        correct: data.object.correct ? "correct" : "incorrect",
        time: answerTime,
        answer: msg.answer,
      });
      break;
    }
    case "updateGameSettings": {
      currentChannelData.gameSettings = msg.settings;
      publish(ws.data.room, {
        type: "updateGameSettings",
        settings: currentChannelData.gameSettings,
      });
      break;
    }
  }
}

async function nextQuestion(
  currentChannelData: channelData,
): Promise<z.infer<typeof serverUpdateGameStateSchema>> {
  const nextQuestionData = (
    await db
      .select()
      .from(Question)
      .where(eq(Question.valid, true))
      .orderBy(sql`RANDOM()`)
      .limit(1)
  )[0]! as typeof Question.$inferSelect;

  const lastQuestionData =
    currentChannelData.gameState.stage === "question"
      ? currentChannelData.gameState.question
      : undefined;

  console.log(nextQuestionData);

  currentChannelData.gameState = {
    stage: "question",
    question: {
      ...serverQuestionSchema.parse(nextQuestionData),
      asked: new Date(),
      questionTime: nextQuestionData.bonus
        ? currentChannelData.gameSettings.timing.bonusTime
        : currentChannelData.gameSettings.timing.time,
      qNumber: lastQuestionData ? lastQuestionData.qNumber + 1 : 1,
    },
    answers: {},
  };

  const outgoingMsg: z.infer<typeof serverUpdateGameStateSchema> = {
    type: "updateGameState",
    state: {
      stage: "question",
      question: {
        ...clientQuestionSchema.parse(nextQuestionData),
        asked: new Date(),
        questionTime: nextQuestionData.bonus
          ? currentChannelData.gameSettings.timing.bonusTime
          : currentChannelData.gameSettings.timing.time,
        qNumber: lastQuestionData ? lastQuestionData.qNumber + 1 : 1,
      },
    },
  };

  return outgoingMsg;
}
