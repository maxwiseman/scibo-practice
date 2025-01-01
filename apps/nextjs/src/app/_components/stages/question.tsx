"use client";

import { useEffect, useState } from "react";
import { IconBan, IconCheck, IconStopwatch, IconX } from "@tabler/icons-react";
import { useSelector } from "@xstate/store/react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

import { cn } from "@scibo/ui";
import { Spinner } from "@scibo/ui/spinner";

import { blurTransition } from "../blur-transition";
import { QuizAnswers } from "../quiz/answers";
import { QuizPrompt } from "../quiz/prompt";
import { SpinText } from "../spin-text";
import websocketStore from "../websocket/xstate";

export function Question() {
  const state = useSelector(websocketStore, (state) => state.context.state);
  const users = useSelector(websocketStore, (state) => state.context.users);
  const [answered, setAnswered] = useState<boolean[]>([]);

  if (state.stage !== "question") return null;

  return (
    <LayoutGroup>
      <div
        className={cn(
          "flex h-full min-h-max w-full max-w-[60rem] flex-col items-center justify-center gap-10",
          // { "justify-between": answered[state.question.qNumber] === true },
        )}
      >
        <AnimatePresence mode="popLayout">
          {answered[state.question.qNumber] !== true && (
            <motion.div
              key="timer"
              className="fixed top-10"
              {...blurTransition}
            >
              <Timer />
            </motion.div>
          )}
          {Object.values(users).filter(
            (i) => i.role === "host" || i.role === "player",
          ).length === Object.keys(state.answers ?? {}).length && (
              <motion.div
                initial={{ scaleX: "0%" }}
                exit={{ translateY: "-2000%" }}
                animate={{ translateY: "0%", scaleX: "100%" }}
                className="fixed top-0 h-2 w-full origin-left bg-foreground"
                transition={{ duration: 10, type: "linear" }}
              />
            )}
          <motion.div
            {...blurTransition}
            layout="position"
            layoutId={`prompt-${state.question.qNumber}`}
            key={`prompt-${state.question.qNumber}`}
            // className="fixed top-8 w-[60rem]"
            className="w-[60rem] origin-bottom"
          >
            <QuizPrompt {...state.question} prompt={state.question.question} />
          </motion.div>

          {answered[state.question.qNumber] === true ? (
            <motion.div
              key={"leaderboard"}
              {...blurTransition}
              className="flex w-[30rem] origin-top flex-col gap-4"
            >
              <Leaderboard />
            </motion.div>
          ) : (
            <motion.div
              className="w-full"
              key={"answer-choices"}
              {...blurTransition}
            >
              <QuizAnswers
                question={state.question}
                onSubmit={(val) => {
                  websocketStore.send({
                    type: "sendMessage",
                    message: { type: "answerQuestion", answer: val },
                  });
                  const answeredCopy = [...answered];
                  answeredCopy[state.question.qNumber] = true;
                  setAnswered(answeredCopy);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div />
      </div>
    </LayoutGroup>
  );
}

export function Timer() {
  const state = useSelector(websocketStore, (state) => state.context.state);
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (state.stage !== "question") return;
    let stop = false;

    function updateTime() {
      if (state.stage !== "question") return;
      const time =
        (new Date().getTime() - state.question.asked.getTime()) / 1000;
      setTime(time);
      console.log(parseInt(time.toString().split(".")[1] ?? "0"));
      if (!stop)
        setTimeout(
          updateTime,
          100 - parseInt(time.toString().split(".")[1] ?? "0"),
        );
    }
    // const interval = setTimeout(() => {
    //   setTime(state.question.asked.getTime() - new Date().getTime());
    updateTime();
    // }, 1000);

    return () => {
      stop = true;
      // clearInterval(interval);
    };
  }, [state]);

  if (state.stage !== "question") return null;
  const remainingTime = state.question.questionTime - Math.round(time);

  const minutes = String(Math.floor(Math.round(remainingTime) / 60)).padStart(
    2,
    "0",
  );
  const seconds = String(Math.round(Math.abs(remainingTime)) % 60).padStart(
    2,
    "0",
  );

  return (
    <div className="flex items-center gap-1 text-lg text-muted-foreground">
      <IconStopwatch className="h-5 w-5" />
      {/* {`${minutes}:${seconds}`} */}
      {`${remainingTime}s`}
    </div>
  );
}

export function Leaderboard() {
  const state = useSelector(websocketStore, (state) => state.context.state);
  const users = useSelector(websocketStore, (state) => state.context.users);
  const self = useSelector(
    websocketStore,
    (state) => state.context.currentUser,
  );

  if (state.stage !== "question") return null;

  const scoreCards = Object.entries(users)
    .sort(([uId, userData], [uId2, userData2]) => {
      if (userData.role !== "host" && userData.role !== "player") return 0;
      if (userData2.role !== "host" && userData2.role !== "player") return 0;
      return userData2.score - userData.score;
    })
    .map(([uId, userData]) => {
      const answer = state.answers?.[uId]?.correct;
      let icon: React.ReactNode = <></>;
      let iconNumber = 0;
      switch (answer) {
        case "correct":
          icon = <IconCheck className="h-6 w-6" />;
          iconNumber = 1;
          break;
        case "incorrect":
          icon = <IconX className="h-6 w-6" />;
          iconNumber = 2;
          break;
        case "skipped":
          icon = <IconBan className="h-6 w-6" />;
          iconNumber = 3;
          break;
        default:
          icon = <Spinner className="h-6 w-6" />;
          iconNumber = 4;
          break;
      }

      if (userData.role !== "host" && userData.role !== "player") return null;

      return (
        <motion.div
          layout="position"
          layoutId={`scorecard-${uId}`}
          key={`scorecard-${uId}`}
          className={cn(
            "flex w-full items-center gap-4 rounded-md bg-muted px-4 py-2 text-2xl",
            { "text-muted-foreground": uId !== self?.id },
          )}
        >
          <AnimatePresence mode="popLayout">
            <motion.div key={`${uId}-icon${iconNumber}`} {...blurTransition}>
              {icon}
            </motion.div>{" "}
            <motion.div key={`${uId}-uname`}>{userData.username}</motion.div>
            <motion.div
              {...blurTransition}
              key={`${uId}-score${userData.score}`}
            >
              {userData.score}
            </motion.div>
            {/* <div key={`${uId}-score`}> */}
            {/*   <SpinText>{userData.score}</SpinText> */}
            {/* </div> */}
          </AnimatePresence>
        </motion.div>
      );
    });
  return (
    <LayoutGroup>
      <AnimatePresence mode="popLayout">{scoreCards}</AnimatePresence>
    </LayoutGroup>
  );
}
