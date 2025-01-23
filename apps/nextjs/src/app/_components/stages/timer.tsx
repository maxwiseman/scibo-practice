import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { IconStopwatch } from "@tabler/icons-react";
import { useSelector } from "@xstate/store/react";
import { motion } from "motion/react";

import websocketStore from "../websocket/xstate";

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

  // const minutes = String(Math.floor(Math.round(remainingTime) / 60)).padStart(
  //   2,
  //   "0",
  // );
  // const seconds = String(Math.round(Math.abs(remainingTime)) % 60).padStart(
  //   2,
  //   "0",
  // );

  return (
    <div className="flex items-center gap-1 text-lg text-muted-foreground">
      <motion.div layout>
        <IconStopwatch className="h-5 w-5" />
      </motion.div>
      {/* {`${minutes}:${seconds}`} */}
      <motion.div layout layoutRoot>
        <NumberFlow trend={-1} suffix="s" value={remainingTime} />
      </motion.div>
    </div>
  );
}
