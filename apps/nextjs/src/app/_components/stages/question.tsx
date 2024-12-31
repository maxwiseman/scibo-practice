"use client";

import { useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useSelector } from "@xstate/store/react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

import { cn } from "@scibo/ui";
import { Spinner } from "@scibo/ui/spinner";

import { blurTransition } from "../blur-transition";
import { QuizAnswers } from "../quiz/answers";
import { QuizPrompt } from "../quiz/prompt";
import websocketStore from "../websocket/xstate";

export function Question() {
  const state = useSelector(websocketStore, (state) => state.context.state);
  const users = useSelector(websocketStore, (state) => state.context.users);
  const [answered, setAnswered] = useState<boolean[]>([]);

  if (state.stage !== "question") return null;

  return (
    <LayoutGroup>
      <div
        className={cn(
          "flex h-full min-h-max w-full max-w-[60rem] flex-col items-center justify-center gap-10",
          // { "justify-between": answered[state.question.qNumber] === true },
        )}
      >
        <AnimatePresence mode="popLayout">
          {Object.keys(users).length ===
            Object.keys(state.answers ?? {}).length && (
              <motion.div
                initial={{ scaleX: "0%" }}
                exit={{ translateY: "-2000%" }}
                animate={{ translateY: "0%", scaleX: "100%" }}
                className="fixed top-0 h-2 w-full origin-left bg-foreground"
                transition={{ duration: 10, type: "linear" }}
              />
            )}
          <motion.div
            {...blurTransition}
            layout="position"
            layoutId={`prompt-${state.question.qNumber}`}
            key={`prompt-${state.question.qNumber}`}
            // className="fixed top-8 w-[60rem]"
            className="w-[60rem] origin-bottom"
          >
            <QuizPrompt {...state.question} prompt={state.question.question} />
          </motion.div>

          {answered[state.question.qNumber] === true ? (
            <motion.div
              key={"leaderboard"}
              {...blurTransition}
              className="flex w-[30rem] origin-top flex-col gap-4"
            >
              <Leaderboard />
            </motion.div>
          ) : (
            <motion.div
              className="w-full"
              key={"answer-choices"}
              {...blurTransition}
            >
              <QuizAnswers
                question={state.question}
                onSubmit={(val) => {
                  websocketStore.send({
                    type: "sendMessage",
                    message: { type: "answerQuestion", answer: val },
                  });
                  const answeredCopy = [...answered];
                  answeredCopy[state.question.qNumber] = true;
                  setAnswered(answeredCopy);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div />
      </div>
    </LayoutGroup>
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
    let iconNumber = 0;
    switch (answer) {
      case "correct":
        icon = <IconCheck className="h-6 w-6" />;
        iconNumber = 1;
        break;
      case "incorrect":
        icon = <IconX className="h-6 w-6" />;
        iconNumber = 2;
        break;
      default:
        icon = <Spinner className="h-6 w-6" />;
        iconNumber = 3;
        break;
    }

    return (
      <div
        className={cn(
          "flex w-full items-center gap-4 rounded-md bg-muted px-4 py-2 text-2xl",
          { "text-muted-foreground": uId !== self?.id },
        )}
      >
        <AnimatePresence mode="popLayout">
          <motion.div key={iconNumber} {...blurTransition}>
            {icon}
          </motion.div>{" "}
          <div>{users[uId]?.username}</div>
        </AnimatePresence>
      </div>
    );
  });
}
