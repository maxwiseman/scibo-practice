import type { HTMLProps } from "react";

import "katex/dist/katex.min.css";

import Latex from "react-latex-next";
import { cn } from "@scibo/ui";

export function Prompt({
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
    <div className={cn("w-full", className)} {...props}>
      <h6 className="text-lg text-muted-foreground">
        {`${bonus ? "Bonus" : "Toss Up"} ‒ ${
          type === "shortAnswer" ? "Short Answer" : "Multiple Choice"
        }`}
      </h6>
      <h2
        className={cn(
          "w-full text-3xl leading-tight",
          { "break-all": prompt.split(" ").length === 1 },
          { "text-5xl": prompt.split(" ").length <= 15 && resize === true },
        )}
      >
        <Latex
          delimiters={[
            { left: "$$", right: "$$", display: false },
            { left: "$", right: "$", display: false },
          ]}
        >
          {prompt}
        </Latex>
      </h2>
    </div>
  );
}
