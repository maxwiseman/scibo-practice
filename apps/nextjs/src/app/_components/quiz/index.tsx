"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { toast } from "@scibo/ui/toast";

import type { sciboQuestion } from "./types";
import { api } from "~/trpc/react";
import { Orb } from "./orb";
import { QuizQuestion } from "./question";

export function Quiz({
  questions,
  debug,
}: {
  questions: sciboQuestion[];
  debug?: boolean;
}) {
  const [questionNumber, setQuestionNumber] = useState(0);
  const [checking, setChecking] = useState(false);
  const question = questions[questionNumber];
  console.log(question);
  const checkMutation = api.quiz.checkAnswer.useMutation();

  function onCheckAnswer(valid: boolean, explanation?: string) {
    if (valid) toast.success("Nice job!");
    else toast.error("Incorrect!", { description: explanation });
  }

  return (
    <div className="grid w-full max-w-[60rem] place-content-center place-items-center gap-10 px-4">
      <AnimatePresence>
        {checking ? (
          <>
            <motion.div
              exit={{
                // y: -25,
                opacity: 0,
                scale: 1.4,
                transition: { ease: "easeIn", duration: 0.3 },
              }}
              initial={{ opacity: 0, scale: 1.45 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1.5,
                transition: { duration: 0.3, delay: 0.3 },
              }}
              style={{ gridRow: 1, gridColumn: 1 }}
            >
              <Orb className="" blur="xl" />
            </motion.div>
            <motion.div
              exit={{
                // y: -25,
                opacity: 0,
                filter: "blur(10px)",
                scale: 0.9,
                transition: { ease: "easeIn", duration: 0.3 },
              }}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                transition: { duration: 0.3, delay: 0.3 },
              }}
              className="fixed bottom-8 cursor-default text-muted-foreground/50"
            >
              Checking your answer...
            </motion.div>
          </>
        ) : (
          <motion.div
            key={`q-${questionNumber}`}
            exit={{
              // y: -25,
              opacity: 0,
              filter: "blur(10px)",
              scale: 0.9,
              transition: { ease: "easeIn", duration: 0.3 },
            }}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 0.3, delay: 0.3 },
            }}
            style={{ gridRow: 1, gridColumn: 1 }}
            // className="w-[60rem]"
          >
            <QuizQuestion
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              question={{ ...question!, qNumber: questionNumber }}
              onSubmit={async (val) => {
                console.log(`${val} - ${val == question?.answer}`);
                setChecking(true);
                if (question?.type === "multipleChoice") {
                  const correctAnswer = question.answer.find(
                    (val) => val.correct,
                  );
                  if (val === correctAnswer?.letter)
                    onCheckAnswer(val === correctAnswer.letter);
                  else
                    onCheckAnswer(
                      val === correctAnswer?.letter,
                      correctAnswer?.answer,
                    );
                } else if (
                  question === undefined ||
                  val.toLowerCase().includes(question.answer.toLowerCase())
                ) {
                  onCheckAnswer(true);
                } else if (val === "") {
                  onCheckAnswer(false, question.answer);
                } else {
                  const data = await checkMutation.mutateAsync({
                    response: val,
                    question,
                  });

                  onCheckAnswer(data.object.correct, data.object.explanation);
                }
                // setTimeout(() => {
                setChecking(false);
                // }, 3000);
                setQuestionNumber(questionNumber + 1);
              }}
              debug={debug}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
