import type { HTMLProps } from "react";
import { useEffect, useRef } from "react";

import { Input } from "@scibo/ui/input";

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
