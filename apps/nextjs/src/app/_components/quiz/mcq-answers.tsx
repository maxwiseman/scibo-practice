"use client";

import type { HTMLProps } from "react";
import { useEffect } from "react";

import { cn } from "@scibo/ui";

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
  }, [answers, onSelectChange]);

  return (
    <div className={cn("grid w-full grid-cols-2 gap-8", className)} {...props}>
      {answers.map((item) => (
        <QuizMcqButton
          key={`${item.letter}-${item.answer}`}
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
