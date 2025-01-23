"use client";

import type { HTMLProps } from "react";
import { useEffect, useState } from "react";
import Latex from "react-latex-next";

import "katex/dist/katex.min.css";

import type { z } from "zod";
import NumberFlow from "@number-flow/react";
import { useSelector } from "@xstate/store/react";
import { LayoutGroup, motion } from "motion/react";

import type { clientAnswerSchema } from "@scibo/multiplayer-server/from-client";
import type { clientMcqAnswerSchema } from "@scibo/multiplayer-server/shared";
import { cn } from "@scibo/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@scibo/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@scibo/ui/tooltip";

import websocketStore from "../websocket/xstate";

export function QuizMcqAnswers({
  className,
  selection,
  onSelectChange,
  responses,
  hideIncorrect = false,
  correct = "",
  locked = false,
  answers,
  ...props
}: HTMLProps<HTMLDivElement> & {
  // answers: {
  //   answer: string;
  //   letter: string;
  //   correct: boolean;
  // }[];
  answers: z.infer<typeof clientMcqAnswerSchema>[];
  responses?: z.infer<typeof clientAnswerSchema>;
  hideIncorrect?: boolean;
  correct?: string;
  locked?: boolean;
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
    <LayoutGroup>
      <div
        className={cn(
          "grid w-full grid-cols-1 gap-8 md:grid-cols-2",
          className,
        )}
        {...props}
      >
        {answers.map((item) =>
          (hideIncorrect && item.letter === correct) || !hideIncorrect ? (
            <QuizMcqButton
              key={`${item.letter}-${item.answer}`}
              letter={item.letter}
              text={item.answer}
              responses={responses}
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

export function QuizMcqButton({
  letter,
  text,
  onSelectChange,
  selected,
  responses,
  locked = false,
  className,
}: HTMLProps<HTMLDivElement> & {
  letter: string;
  text: string;
  onSelectChange: (val: boolean) => void;
  selected: boolean;
  responses?: z.infer<typeof clientAnswerSchema>;
  locked?: boolean;
}) {
  const users = useSelector(websocketStore, (i) => i.context.users);
  const formattedResponses = Object.entries(responses ?? {})
    .map(([uId, data]) => {
      if (users[uId]?.role !== "player" && users[uId]?.role !== "host")
        return undefined;
      return {
        ...users[uId],
        ...data,
      };
    })
    .filter((i) => i !== undefined)
    .filter((i) => i.answer === letter);

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
            "flex aspect-square h-10 w-10 items-center justify-center rounded-md border border-input bg-background font-bold text-muted-foreground shadow-sm transition-[font-weight,color,background-color,border-color,text-decoration-color,fill,stroke]",
            {
              "bg-accent/50 font-bold text-accent-foreground": selected,
              "hover:bg-accent hover:text-accent-foreground": !locked,
            },
          )}
        >
          {letter}
        </motion.div>
        <div
          className={cn(
            "flexflex-col mt-2 gap-1 text-left text-muted-foreground transition-[font-weight]",
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
          <motion.div>
            <AvatarStack max={3} users={formattedResponses ?? []} />
          </motion.div>
        </div>
      </button>
    </div>
  );
}

function AvatarStack({
  users,
  max = 3,
}: {
  users: { username: string; image?: string }[];
  max?: number;
}) {
  return (
    <LayoutGroup>
      <div className="flex">
        {users.map((user, i) => {
          if (i < max) {
            const initials = user.username
              .split(" ")
              .map((j) => j.at(0))
              .join("");
            return (
              <motion.div
                initial={{ translateX: "100%", opacity: "0%" }}
                animate={{ translateX: "0%", opacity: "100%" }}
                layout
              >
                <Tooltip>
                  <TooltipContent>{user.username}</TooltipContent>
                  <TooltipTrigger asChild>
                    <Avatar
                      className={cn(
                        "h-6 w-6 outline outline-2 outline-background",
                        {
                          "-ml-2": i !== 0,
                        },
                      )}
                    >
                      <AvatarImage src={user.image} />
                      <AvatarFallback
                        className={cn(
                          "text-sm font-normal text-muted-foreground",
                          {
                            "text-xs": initials.length > 1,
                          },
                        )}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                </Tooltip>
              </motion.div>
            );
          }
          if (i === max) {
            return (
              <motion.div
                initial={{ translateX: "100%", opacity: "0%" }}
                animate={{ translateX: "0%", opacity: "100%" }}
                layout
              >
                <Tooltip>
                  <TooltipContent>
                    {users
                      .slice(i)
                      .map((j) => j.username)
                      .join(", ")}
                  </TooltipContent>
                  <TooltipTrigger asChild>
                    <Avatar
                      className={cn(
                        "h-6 w-6 outline outline-2 outline-background",
                        {
                          "-ml-2": i !== 0,
                        },
                      )}
                    >
                      <AvatarImage />
                      <AvatarFallback className="text-xs font-normal text-muted-foreground">
                        <NumberFlow value={users.length - i} prefix="+" />
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                </Tooltip>
              </motion.div>
            );
          }
        })}
      </div>
    </LayoutGroup>
  );
}
