"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { z } from "zod";

import { serverQuestionSchema } from "@scibo/multiplayer-server/shared";
import { Button } from "@scibo/ui/button";

import { blurTransition } from "../_components/blur-transition";
import { QuizAnswers } from "../_components/quiz/answers";
import { QuizMcqButton } from "../_components/quiz/mcq-answers";
import { QuizPrompt } from "../_components/quiz/prompt";

export default function Page() {
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState(false);

  const [changingNumber, setChangingNumber] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setChangingNumber((i) => i + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Button
        onClick={() => {
          setResults(!results);
        }}
        className="fixed bottom-5"
      >
        Toggle Results
      </Button>
      <div className="flex h-full min-h-max w-full max-w-[60rem] flex-col items-center justify-center gap-10">
        <LayoutGroup>
          <AnimatePresence>
            <motion.div layout>
              <QuizPrompt prompt={questionDemoData.question} />
            </motion.div>
            {results ? (
              <div className="mt-4 flex w-full flex-col gap-4">
                <QuizMcqButton
                  letter="Z"
                  text="Spontaneous mutations"
                  selected={false}
                  onSelectChange={() => {}}
                />
                <motion.div
                  {...blurTransition}
                  className="text-muted-foreground"
                >
                  {questionDemoData.explanation}
                </motion.div>
              </div>
            ) : (
              <QuizAnswers
                locked={answered}
                onSubmit={() => {
                  setAnswered(!answered);
                }}
                question={questionDemoData}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  );
}

const questionDemoData: z.infer<typeof serverQuestionSchema> & {
  qNumber: number;
} = {
  bonus: false,
  number: 23,
  topic: "biology",
  type: "multipleChoice",
  qNumber: 1,
  question:
    "A child who excretes black urine is born to two normal parents. The child has a recessive homozygous genotype. What is the most likely explanation for the genotype?",
  answer: [
    {
      answer: "Spontaneous mutations",
      pronunciations: [],
      letter: "W",
      correct: false,
    },
    {
      answer: "Consanguinity",
      pronunciations: ["kon-sang-GWIN-i-tee"],
      letter: "X",
      correct: true,
    },
    {
      answer: "Anticipation",
      pronunciations: [],
      letter: "Y",
      correct: false,
    },
    {
      answer: "Environmental exposure",
      pronunciations: [],
      letter: "Z",
      correct: false,
    },
  ],
  htmlUrl:
    "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-7/ROUND-9.pdf#page=12",
  pronunciations: ["kon-sang-GWIN-i-tee"],
  explanation:
    "Consanguinity refers to the mating of individuals who are closely related genetically. In this case, the child has a recessive homozygous genotype, which is more likely to occur if the parents are related, as they may both carry the same recessive allele for the condition that causes black urine.",
  valid: true,
};
