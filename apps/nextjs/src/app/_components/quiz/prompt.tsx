import type { HTMLProps } from "react";

import { cn } from "@scibo/ui";

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
          { "break-all": prompt.split(" ").length === 1 },
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
