"use client";

import Link from "next/link";
import { IconCheck, IconExternalLink, IconX } from "@tabler/icons-react";
import { useSelector } from "@xstate/store/react";
import Latex from "react-latex-next";

import { question } from "@scibo/db/types";
import { cn } from "@scibo/ui";
import { LinkButton } from "@scibo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@scibo/ui/card";

import websocketStore from "../websocket/xstate";

export function Results() {
  const state = useSelector(websocketStore, (state) => state.context.state);
  const users = useSelector(websocketStore, (state) => state.context.users);
  const self = useSelector(
    websocketStore,
    (state) => state.context.currentUser,
  );

  if (state.stage !== "results") return null;
  return (
    <div className="mt-56 flex flex-col items-center gap-10">
      <div className="flex w-full max-w-[35rem] gap-2">
        {Object.entries(users)
          .sort(([_, userData1], [__, userData2]) =>
            userData1.role !== "spectator" && userData2.role !== "spectator"
              ? userData2.score - userData1.score
              : 0,
          )
          .map(([uId, userData], i) =>
            userData.role === "spectator" ? null : (
              <div
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-md bg-muted px-4 py-2 text-2xl",
                  { "text-muted-foreground": uId !== self?.id },
                )}
              >
                <div className="flex gap-2">
                  <div className="text-muted-foreground">{`#${i + 1}`}</div>
                  <div>{userData.username}</div>
                </div>
                <div className="text-muted-foreground">{userData.score}</div>
              </div>
            ),
          )}
      </div>
      <div className="flex flex-col gap-6">
        {state.history.map((q) => (
          <Card className="max-w-[60rem]">
            <CardHeader>
              <CardTitle className="text-lg">
                <Latex
                  delimiters={[
                    { left: "$$", right: "$$", display: false },
                    { left: "$", right: "$", display: false },
                  ]}
                >
                  {q.question.question}
                </Latex>
                <LinkButton
                  variant="ghost"
                  size="icon"
                  target="_blank"
                  className="relative top-1 ml-2 inline-flex h-7 w-7"
                  href={q.question.htmlUrl}
                >
                  <IconExternalLink className="h-4 w-4 text-muted-foreground" />
                </LinkButton>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 text-muted-foreground">
              {q.question.type === "multipleChoice" && (
                <div className="grid grid-cols-2 gap-2">
                  {q.question.answer.map((a) => (
                    <div
                      className={cn("flex gap-3", {
                        "font-bold text-foreground":
                          q.answers[self?.id ?? ""]?.answer === a.letter,
                      })}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border shadow-sm">
                        {a.correct ? (
                          <IconCheck className="h-4 w-4" />
                        ) : (
                          <IconX className="h-4 w-4" />
                        )}
                      </div>
                      <span className="mt-1">{a.answer}</span>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <Latex
                  delimiters={[
                    { left: "$$", right: "$$", display: false },
                    { left: "$", right: "$", display: false },
                  ]}
                >
                  {q.question.explanation}
                </Latex>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
