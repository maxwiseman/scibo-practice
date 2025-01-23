"use client";

import { useEffect, useState } from "react";
import { IconBan, IconCheck, IconX } from "@tabler/icons-react";
import { useMeasure } from "@uidotdev/usehooks";
import { useSelector } from "@xstate/store/react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Latex from "react-latex-next";

import { cn } from "@scibo/ui";
import { Input } from "@scibo/ui/input";
import { Spinner } from "@scibo/ui/spinner";

import { blurTransition } from "../blur-transition";
import { QuizMcqButton } from "../quiz/mcq-answers";
import { QuizPrompt } from "../quiz/prompt";
import websocketStore from "../websocket/xstate";
import { Timer } from "./timer";

export function Question() {
  const state = useSelector(websocketStore, (state) => state.context.state);
  const self = useSelector(
    websocketStore,
    (state) => state.context.currentUser,
  );
  const settings = useSelector(
    websocketStore,
    (state) => state.context.settings,
  );
  const users = useSelector(websocketStore, (state) => state.context.users);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [answer, setAnswer] = useState("");
  const [ref, bounds] = useMeasure();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        state.stage === "question" &&
        (event.key === "Enter" || event.keyCode === 13)
      ) {
        if (answered[state.question.qNumber]) return;
        websocketStore.send({
          type: "sendMessage",
          message: { type: "answerQuestion", answer },
        });
        // const answeredCopy = [...answered];
        // answeredCopy[state.question.qNumber] = true;
        setAnswered((prev) => {
          const adjusted = [...prev];
          adjusted[state.question.qNumber] = true;
          return adjusted;
        });
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [answer, answered, state]);

  useEffect(() => {
    setAnswer("");
    // @ts-expect-error -- this is fine, typescript just doesn't like it
  }, [state.question.qNumber]);

  if (state.stage !== "question") return null;
  // const correctAnswer =
  //   state.question.type === "multipleChoice"
  //     ? state.question.answer.find((i) => i.letter === state.correctAnswer)
  //       ?.answer
  //     : state.correctAnswer;
  const allAnswered =
    Object.values(users).filter((i) => i.role === "host" || i.role === "player")
      .length === Object.keys(state.answers ?? {}).length;

  return (
    <>
      <AnimatePresence>
        {allAnswered && (
          <motion.div
            initial={{ scaleX: "0%" }}
            exit={{ translateY: "-2000%" }}
            animate={{ translateY: "0%", scaleX: "100%" }}
            className="fixed top-0 h-2 w-full origin-left bg-foreground"
            transition={{ duration: 10, type: "linear" }}
          />
        )}
        {settings.timing.enabled === true &&
          answered[state.question.qNumber] !== true && (
            <motion.div
              key="timer"
              className="fixed top-10"
              {...blurTransition}
            >
              <Timer />
            </motion.div>
          )}
      </AnimatePresence>
      <div
        className={cn(
          "flex h-full min-h-max w-full max-w-[60rem] flex-col items-center justify-center space-y-10",
          // { "justify-between": answered[state.question.qNumber] === true },
        )}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            {...blurTransition}
            // layout="position"
            // key="prompt"
            key={state.question.qNumber}
            className="w-[60rem] origin-bottom"
          >
            <QuizPrompt {...state.question} prompt={state.question.question} />
          </motion.div>
          {/* <div key="height-tester">{bounds.height}</div> */}

          <motion.div
            className={"w-full"}
            key={`answer-choices-${state.question.qNumber}`}
            {...blurTransition}
            animate={{
              height: bounds.height ?? 0,
              ...blurTransition.animate,
            }}
          >
            <LayoutGroup>
              <div
                className={cn("w-full", {
                  "grid w-full grid-cols-1 gap-8 md:grid-cols-2":
                    state.question.type === "multipleChoice",
                })}
                ref={ref}
              >
                <AnimatePresence mode="popLayout">
                  {state.question.type === "multipleChoice" ? (
                    state.question.answer
                      .sort((a, b) => a.letter.localeCompare(b.letter))
                      .map((choice) =>
                        state.correctAnswer !== choice.letter &&
                        allAnswered ? null : (
                          <motion.div
                            layout
                            key={`answer-choice-${choice.letter}-${state.question.qNumber}`}
                            {...blurTransition}
                          >
                            <QuizMcqButton
                              {...choice}
                              text={choice.answer}
                              selected={
                                answer.toLowerCase() ===
                                choice.letter.toLowerCase()
                              }
                              responses={state.answers}
                              locked={answered[state.question.qNumber]}
                              onSelectChange={() => {
                                console.log("Changing", choice.letter);
                                setAnswer(choice.letter);
                              }}
                            />
                          </motion.div>
                        ),
                      )
                  ) : answered[state.question.qNumber] ? (
                    <motion.div
                      {...blurTransition}
                      key="response"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <LayoutGroup>
                        <AnimatePresence mode="popLayout">
                          <motion.div
                            {...blurTransition}
                            key={state.answers?.[self?.id ?? ""]?.correct}
                          >
                            {state.answers?.[self?.id ?? ""]?.correct ===
                              "correct" && <IconCheck />}
                            {state.answers?.[self?.id ?? ""]?.correct ===
                              "incorrect" && <IconX />}
                            {state.answers?.[self?.id ?? ""]?.correct ===
                              "grading" && <Spinner />}
                            {state.answers?.[self?.id ?? ""]?.correct ===
                              "skipped" && <IconBan />}
                          </motion.div>
                        </AnimatePresence>
                        <motion.div layout key="response-text">
                          {answer}
                        </motion.div>
                      </LayoutGroup>
                    </motion.div>
                  ) : (
                    <motion.div key="text-input" {...blurTransition}>
                      <Input
                        onChange={(e) => {
                          if (answered[state.question.qNumber]) return;
                          console.log("Changing2", e.target.value);
                          setAnswer(e.target.value);
                        }}
                        value={answer}
                        placeholder="Type something..."
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </LayoutGroup>
          </motion.div>
          {state.explanation && (
            <motion.div
              key={state.explanation}
              className="w-full text-muted-foreground"
              {...blurTransition}
              initial={{ height: 0, marginTop: 0, ...blurTransition.initial }}
              animate={{
                height: "auto",
                marginTop: "2.5rem",
                ...blurTransition.animate,
              }}
            >
              <Latex
                delimiters={[
                  { left: "$$", right: "$$", display: false },
                  { left: "$", right: "$", display: false },
                ]}
              >
                {state.explanation ?? ""}
              </Latex>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
