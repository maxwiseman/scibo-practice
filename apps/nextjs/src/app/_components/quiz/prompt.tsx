import type { HTMLProps } from "react";

import { cn } from "@scibo/ui";

import "katex/dist/katex.min.css";

import Latex from "react-latex-next";

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
        <Latex delimiters={[{ left: "$$", right: "$$", display: false }]}>
          {prompt}
        </Latex>
      </h2>
    </div>
  );
}
