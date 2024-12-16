"use client";

import type { HTMLProps } from "react";
import { useEffect, useRef, useState } from "react";
import { IconArrowForward } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { isMobile } from "react-device-detect";

import { cn } from "@scibo/ui";
import { Button } from "@scibo/ui/button";
import { Input } from "@scibo/ui/input";

export function Quiz({
  questions,
  debug,
}: {
  questions: sciboQuestion[];
  debug?: boolean;
}) {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [checking, setChecking] = useState(false);
  const question = questions[questionNumber];

  return (
    <div className="grid w-full max-w-[60rem] place-content-center place-items-center gap-10 px-4">
      <AnimatePresence>
        {checking ? (
          <></>
        ) : (
          <motion.div
            key={`q-${questionNumber}`}
            exit={{
              // y: -25,
              opacity: 0,
              filter: "blur(10px)",
              scale: 0.9,
              transition: { ease: "easeIn", duration: 0.3 },
            }}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 0.3 },
            }}
            style={{ gridRow: 1, gridColumn: 1 }}
          >
            <QuizQuestion
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              question={{ ...question!, qNumber: questionNumber }}
              onSubmit={(val) => {
                console.log(`${val} - ${val == question?.answer}`);
                setChecking(true);
                setTimeout(() => {
                  setChecking(false);
                }, 1000);
                setQuestionNumber(questionNumber + 1);
              }}
              debug={debug}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
          {question.originalText}
        </a>
      )}
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
      {isMobile === true && (
        <Button
          suppressHydrationWarning
          className="w-full"
          onClick={() => onSubmit(answer)}
        >
          Submit
        </Button>
      )}
    </div>
  );
}

export function QuizPrompt({
  prompt,
  bonus,
  type,
  resize,
  className,
  ...props
}: HTMLProps<HTMLDivElement> & {
  prompt: string;
  bonus?: boolean;
  type?: "shortAnswer" | "multipleChoice";
  resize?: boolean;
}) {
  return (
    <div className="w-full">
      <h6 className="text-lg text-muted-foreground">
        {`${bonus ? "Bonus" : "Toss Up"} ‒ ${type === "shortAnswer" ? "Short Answer" : "Multiple Choice"}`}
      </h6>
      <h2
        className={cn(
          "w-full text-3xl leading-tight",
          { "text-5xl": prompt.split(" ").length <= 15 && resize === true },
          className,
        )}
        {...props}
      >
        {prompt}
      </h2>
    </div>
  );
}

export function QuizShortAnswer({
  answer,
  onAnswerChange,
  ...props
}: HTMLProps<HTMLInputElement> & {
  answer: string;
  onAnswerChange: (val: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <Input
      ref={inputRef}
      value={answer}
      onChange={(e) => {
        onAnswerChange(e.target.value);
      }}
      placeholder="Answer here..."
      {...props}
    />
  );
}

export function QuizMcqAnswers({
  className,
  selection,
  onSelectChange,
  answers,
  ...props
}: HTMLProps<HTMLDivElement> & {
  answers: {
    answer: string;
    letter: string;
    correct: boolean;
  }[];
  selection: string;
  onSelectChange: (val: string) => void;
}) {
  // const [selected, setSelected] = useState(selection);
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      answers.forEach((item, index) => {
        if (event.key === item.letter.toLowerCase()) {
          onSelectChange(item.letter);
          // setSelected(item.letter);
        }
        if (event.key === (index + 1).toString()) {
          onSelectChange(item.letter);
          // setSelected(item.letter);
        }
      });
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [answers]);

  return (
    <div className={cn("grid w-full grid-cols-2 gap-8", className)} {...props}>
      {answers.map((item) => (
        <QuizMcqButton
          letter={item.letter}
          text={item.answer}
          onSelectChange={(val) => {
            if (val) {
              onSelectChange(item.letter);
              // setSelected(item.letter);
            }
          }}
          selected={selection == item.letter}
        />
      ))}
    </div>
  );
}

export function QuizMcqButton({
  letter,
  text,
  onSelectChange,
  selected,
  className,
}: HTMLProps<HTMLDivElement> & {
  letter: string;
  text: string;
  onSelectChange: (val: boolean) => void;
  selected: boolean;
}) {
  return (
    <button
      onClick={() => onSelectChange(!selected)}
      // className={cn(
      //   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md p-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      // )}
      className={cn(
        "flex gap-6 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
    >
      <div
        className={cn(
          "flex aspect-square h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-input bg-background font-bold text-muted-foreground shadow-sm transition-[font-weight,color,background-color,border-color,text-decoration-color,fill,stroke] hover:bg-accent hover:text-accent-foreground",
          { "bg-accent/50 font-bold text-accent-foreground": selected },
        )}
      >
        {letter}
      </div>
      <div
        className={cn(
          "mt-2 cursor-pointer text-left text-muted-foreground transition-[font-weight]",
          {
            "font-semibold text-foreground": selected,
          },
        )}
      >
        {text}
      </div>
    </button>
  );
}

export type sciboTopic =
  | "biology"
  | "physics"
  | "math"
  | "earth science"
  | "earth and space"
  | "energy"
  | "general science"
  | "astronomy"
  | "chemistry";
export interface sciboQuestion {
  bonus: boolean;
  number: number;
  topic: sciboTopic;
  type: "shortAnswer" | "multipleChoice";
  question: string;
  answer: string | { answer: string; letter: string; correct: boolean }[];
  htmlUrl: string;
  originalText: string;
}
