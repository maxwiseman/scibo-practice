"use client";

import { useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useSelector } from "@xstate/store/react";

import { cn } from "@scibo/ui";
import { Spinner } from "@scibo/ui/spinner";

import { QuizQuestion } from "../quiz/question";
import websocketStore from "../websocket/xstate";

export function Question() {
  const state = useSelector(websocketStore, (state) => state.context.state);
  const [answered, setAnswered] = useState<boolean[]>([]);

  if (state.stage !== "question") return null;

  return (
    <div className="max-w-[60rem]">
      {answered[state.question.qNumber] === true ? (
        <div className="flex w-[30rem] flex-col gap-4">
          <Leaderboard />
        </div>
      ) : (
        <QuizQuestion
          onSubmit={(val) => {
            websocketStore.send({
              type: "sendMessage",
              message: { type: "answerQuestion", answer: val },
            });
            const answeredCopy = [...answered];
            answeredCopy[state.question.qNumber] = true;
            setAnswered(answeredCopy);
          }}
          question={state.question}
        />
      )}
    </div>
  );
}

export function Leaderboard() {
  const state = useSelector(websocketStore, (state) => state.context.state);
  const users = useSelector(websocketStore, (state) => state.context.users);
  const self = useSelector(
    websocketStore,
    (state) => state.context.currentUser,
  );

  if (state.stage !== "question") return null;

  return Object.keys(users).map((uId) => {
    const answer = state.answers?.[uId]?.correct;
    let icon: React.ReactNode = <></>;
    switch (answer) {
      case "correct":
        icon = <IconCheck className="h-6 w-6" />;
        break;
      case "incorrect":
        icon = <IconX className="h-6 w-6" />;
        break;
      default:
        icon = <Spinner className="h-6 w-6" />;
        break;
    }

    return (
      <div
        className={cn(
          "flex w-full items-center gap-4 rounded-md bg-muted px-4 py-2 text-2xl",
          { "text-muted-foreground": uId !== self?.id },
        )}
      >
        {icon} {users[uId]?.username}
      </div>
    );
  });
}
