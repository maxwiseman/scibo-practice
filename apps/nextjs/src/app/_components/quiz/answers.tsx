"use client";

import { useEffect, useState } from "react";
import { IconArrowForward } from "@tabler/icons-react";
import { useSelector } from "@xstate/store/react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { isMobile } from "react-device-detect";
import { z } from "zod";

import { clientAnswerSchema } from "@scibo/multiplayer-server/from-client";
import { serverAnswerSchema } from "@scibo/multiplayer-server/from-server";
import { clientQuestionSchema } from "@scibo/multiplayer-server/shared";
import { Button } from "@scibo/ui/button";

import { blurTransition } from "../blur-transition";
import websocketStore from "../websocket/xstate";
import { QuizMcqAnswers } from "./mcq-answers";
import { QuizShortAnswer } from "./short-answer";

export function QuizAnswers({
  question,
  responses,
  locked = false,
  hideIncorrect,
  correct,
  onSubmit,
}: {
  question: z.infer<typeof clientQuestionSchema> & { qNumber: number };
  responses?: z.infer<typeof clientAnswerSchema>;
  hideIncorrect?: boolean;
  correct?: string;
  locked?: boolean;
  debug?: boolean;
  onSubmit: (val: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const users = useSelector(websocketStore, (i) => i.context.users);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.keyCode === 13) {
        onSubmit(answer);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [answer, onSubmit]);
  useEffect(() => {
    setAnswer("");
  }, [question.qNumber]);

  return (
    <div className="flex w-full flex-col items-center gap-12">
      <LayoutGroup>
        {question.type === "shortAnswer" ? (
          <QuizShortAnswer answer={answer} onAnswerChange={setAnswer} />
        ) : (
          <QuizMcqAnswers
            selection={answer}
            onSelectChange={setAnswer}
            answers={question.answer}
            responses={responses}
            hideIncorrect={hideIncorrect}
            correct={correct}
            locked={locked}
          />
        )}
        <AnimatePresence mode="popLayout">
          {isMobile === true ? (
            <Button
              suppressHydrationWarning
              className="w-full"
              onClick={() => onSubmit(answer)}
            >
              Submit
            </Button>
          ) : (
            question.qNumber === 1 &&
            !locked && (
              <motion.div
                layout
                {...blurTransition}
                initial={false}
                onClick={() => {
                  // setQuestionNumber(question.qNumber + 1);
                }}
                className="flex cursor-default items-center gap-1 text-sm text-muted-foreground opacity-75"
              >
                <span className="inline-flex items-center gap-1 rounded-sm bg-muted p-1 px-2 text-xs">
                  <IconArrowForward className="h-3 w-3" />
                  Enter
                </span>{" "}
                to submit
              </motion.div>
            )
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
