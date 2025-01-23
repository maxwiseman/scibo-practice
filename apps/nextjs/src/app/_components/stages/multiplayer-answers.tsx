"use client";

import { useEffect, useState } from "react";
import { IconArrowForward } from "@tabler/icons-react";
import { isMobile } from "react-device-detect";
import { z } from "zod";

import { clientQuestionSchema } from "@scibo/multiplayer-server/shared";
import { Button } from "@scibo/ui/button";

import { QuizMcqAnswers } from "../quiz/mcq-answers";
import { QuizShortAnswer } from "../quiz/short-answer";

export function QuizAnswers({
  question,
  onSubmit,
}: {
  // question: sciboQuestion & { qNumber: number };
  question: z.infer<typeof clientQuestionSchema> & { qNumber: number };
  debug?: boolean;
  onSubmit: (val: string) => void;
}) {
  const [answer, setAnswer] = useState("");
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
  }, [question]);

  return (
    <div className="flex w-full flex-col items-center gap-12">
      {question.type === "shortAnswer" ? (
        <QuizShortAnswer answer={answer} onAnswerChange={setAnswer} />
      ) : (
        <QuizMcqAnswers
          selection={answer}
          onSelectChange={setAnswer}
          answers={question.answer}
        />
      )}
      {isMobile === true ? (
        <Button
          suppressHydrationWarning
          className="w-full"
          onClick={() => onSubmit(answer)}
        >
          Submit
        </Button>
      ) : (
        <>
          {question.qNumber === 1 && (
            <div
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
