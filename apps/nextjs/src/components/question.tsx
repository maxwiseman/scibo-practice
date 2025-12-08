"use client";

import type { questionSelect } from "@scibo/db/schema";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { use } from "react";
import type z from "zod";
import { Prompt } from "./prompt";
import { Answers } from "./answers";
import { cn } from "@scibo/ui";

export function Question({
  data,
  className,
  ...props
}: {
  data:
    | Promise<z.infer<typeof questionSelect> | undefined>
    | z.infer<typeof questionSelect>;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const question = data instanceof Promise ? use(data) : data;
  if (!question) return null;
  return (
    <div className={cn("flex flex-col gap-12", className)} {...props}>
      <Prompt
        prompt={question.prompt}
        type={question.type}
        bonus={question.bonus}
      />
      <Answers answer={question.answer} />
      {/* <p>{question.answer}</p>
      <p>{question.explanation}</p> */}
    </div>
  );
}
