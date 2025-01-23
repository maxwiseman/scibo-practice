import { IconBan, IconCheck, IconX } from "@tabler/icons-react";
import { useSelector } from "@xstate/store/react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

import { cn } from "@scibo/ui";
import { Spinner } from "@scibo/ui/spinner";

import { blurTransition } from "../blur-transition";
import websocketStore from "../websocket/xstate";

export function Leaderboard() {
  const state = useSelector(websocketStore, (state) => state.context.state);
  const users = useSelector(websocketStore, (state) => state.context.users);
  const self = useSelector(
    websocketStore,
    (state) => state.context.currentUser,
  );

  if (state.stage !== "question") return null;

  const scoreCards = Object.entries(users)
    .sort(([_, userData], [__, userData2]) => {
      if (userData.role !== "host" && userData.role !== "player") return 0;
      if (userData2.role !== "host" && userData2.role !== "player") return 0;
      return userData2.score - userData.score;
    })
    .map(([uId, userData]) => {
      const answer = state.answers?.[uId];
      let icon: React.ReactNode = <></>;
      let iconNumber = 0;
      switch (answer?.correct) {
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
          {...blurTransition}
          layout="position"
          layoutId={`scorecard-${uId}`}
          key={`scorecard-${uId}`}
          className={cn(
            "flex w-full items-center gap-4 rounded-md bg-muted px-4 py-2 text-2xl",
            { "text-muted-foreground": uId !== self?.id },
          )}
        >
          <LayoutGroup>
            <AnimatePresence mode="wait">
              <motion.div key={`${uId}-icon${iconNumber}`} {...blurTransition}>
                {icon}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div key={`${uId}-uname`} className="w-max shrink-0">
                {userData.username}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                {...blurTransition}
                key={`${uId}-answer${answer?.answer}`}
                className="line-clamp-1 w-full shrink grow text-sm text-muted-foreground"
              >
                {state.question.type === "multipleChoice"
                  ? state.question.answer.find(
                    (a) => a.letter === answer?.answer,
                  )?.answer
                  : answer?.answer}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
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
          </LayoutGroup>
        </motion.div>
      );
    });
  return (
    <LayoutGroup>
      <AnimatePresence mode="popLayout">{scoreCards}</AnimatePresence>
    </LayoutGroup>
  );
}
