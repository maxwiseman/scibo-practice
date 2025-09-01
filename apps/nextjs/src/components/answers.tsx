"use client";

import type { HTMLProps } from "react";
import { useEffect, useState } from "react";
import Latex from "react-latex-next";

import "katex/dist/katex.min.css";

import type { z } from "zod";
import { LayoutGroup, motion } from "motion/react";

import { cn } from "@scibo/ui";
import type { questionSelect } from "@scibo/db/schema";
import { Button } from "@scibo/ui/button";

export function Answers({
  className,
  selection: externalSelection,
  onSelectChange: externalOnSelectChange,
  hideIncorrect = false,
  correct = "",
  locked = false,
  answer,
  ...props
}: HTMLProps<HTMLDivElement> & {
  // answers: {
  //   answer: string;
  //   letter: string;
  //   correct: boolean;
  // }[];
  answer: z.infer<typeof questionSelect>["answer"];
  hideIncorrect?: boolean;
  correct?: string;
  locked?: boolean;
  selection?: string;
  onSelectChange?: (val: string) => void;
}) {
  console.log("Answers", answer);
  const [internalSelection, internalOnSelectChange] = useState<
    string | undefined
  >(undefined);
  const selection = externalSelection ?? internalSelection;
  const onSelectChange = externalOnSelectChange ?? internalOnSelectChange;
  // const [selected, setSelected] = useState(selection);
  useEffect(() => {
    if (typeof answer !== "object") return () => null;
    const handleKeyPress = (event: KeyboardEvent) => {
      answer.forEach((item, index) => {
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
  }, [answer, onSelectChange]);
  if (typeof answer !== "object") return null;

  return (
    <LayoutGroup>
      <div
        className={cn(
          "grid w-full grid-cols-1 gap-8 md:grid-cols-2",
          className,
        )}
        {...props}
      >
        {answer.map((item) =>
          (hideIncorrect && item.letter === correct) || !hideIncorrect ? (
            <McqAnswerChoice
              key={`${item.letter}-${item.answer}`}
              letter={item.letter}
              text={item.answer}
              locked={locked}
              onSelectChange={(val) => {
                if (val) {
                  onSelectChange(item.letter);
                  // setSelected(item.letter);
                }
              }}
              selected={selection == item.letter}
            />
          ) : null,
        )}
      </div>
    </LayoutGroup>
  );
}

export function McqAnswerChoice({
  letter,
  text,
  onSelectChange,
  selected,
  locked = false,
  className,
}: HTMLProps<HTMLDivElement> & {
  letter: string;
  text: string;
  onSelectChange: (val: boolean) => void;
  selected: boolean;
  locked?: boolean;
}) {
  return (
    <div
    // key={`mcq-button-${letter}`}
    // layoutId={`mcq-button-${letter}`}
    // layout
    >
      <button
        onClick={() => {
          if (!locked) onSelectChange(!selected);
        }}
        // className={cn(
        //   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md p-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        // )}
        className={cn(
          "flex gap-6 rounded-md transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50",
          { "cursor-default": locked, "opacity-50": locked && !selected },
          className,
        )}
        disabled={locked}
      >
        <motion.div
          layout="position"
          className={cn(
            "flex aspect-square h-10 w-10 items-center justify-center rounded-md border border-input bg-background font-bold text-muted-foreground shadow-sm/4 transition-[font-weight,color,background-color,border-color,text-decoration-color,fill,stroke]",
            {
              "bg-accent/50 dark:bg-card font-bold text-accent-foreground":
                selected,
              "hover:bg-accent hover:text-accent-foreground": !locked,
            },
          )}
        >
          {letter}
        </motion.div>
        <div
          className={cn(
            "flex flex-col mt-2 gap-1 text-left text-muted-foreground transition-[font-weight]",
            {
              "font-semibold text-foreground": selected,
            },
          )}
        >
          <motion.div layout="position">
            <Latex
              delimiters={[
                { left: "$$", right: "$$", display: false },
                { left: "$", right: "$", display: false },
              ]}
            >
              {text}
            </Latex>
          </motion.div>
        </div>
      </button>
    </div>
  );
}
