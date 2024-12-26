"use client";

import { useEffect, useState } from "react";
import { IconArrowForward } from "@tabler/icons-react";
import { isMobile } from "react-device-detect";

import { Button } from "@scibo/ui/button";

import type { sciboQuestion } from "./types";
import { QuizMcqAnswers } from "./mcq-answers";
import { QuizPrompt } from "./prompt";
import { QuizShortAnswer } from "./short-answer";

export function QuizQuestion({
  question,
  debug,
  onSubmit,
}: {
  question: sciboQuestion & { qNumber: number };
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
    <div
      // transition={{ duration: 2, ease: "easeOut" }}
      className="flex w-full flex-col items-center gap-10"
    >
      <QuizPrompt
        bonus={question.bonus}
        type={question.type}
        prompt={question.question}
      />
      {typeof question.answer === "string" ? (
        <QuizShortAnswer answer={answer} onAnswerChange={setAnswer} />
      ) : (
        <QuizMcqAnswers
          selection={answer}
          onSelectChange={setAnswer}
          answers={question.answer}
        />
      )}
      {debug === true && (
        <a
          href={question.htmlUrl}
          className="text-sm text-muted-foreground underline"
        >
          {question.topic}
        </a>
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
          {question.qNumber === 0 && (
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
