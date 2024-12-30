"use client";

import { useEffect, useState } from "react";
import { useSelector } from "@xstate/store/react";
import { AnimatePresence, motion } from "motion/react";

import { blurTransition } from "../_components/blur-transition";
import { Orb } from "../_components/quiz/orb";
import { QuizQuestion } from "../_components/quiz/question";
import { SpinText } from "../_components/spin-text";
import { Lobby } from "../_components/stages/lobby";
import websocketStore from "../_components/websocket/xstate";

export default function Page() {
  const state = useSelector(websocketStore, (state) => state.context.state);
  const status = useSelector(websocketStore, (state) => state.context.status);
  const users = useSelector(websocketStore, (state) => state.context.users);
  const [answered, setAnswered] = useState<boolean[]>([]);

  // useEffect(() => {
  //   setAnswered(false);
  // }, [state.question?.qNumber]);

  if (state.stage === "lobby" || status !== "connected")
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Lobby />
      </div>
    );
  if (state.stage === "question")
    return (
      <div className="flex h-full min-h-max w-full items-center justify-center p-4">
        <div className="max-w-[60rem]">
          {answered[state.question.qNumber] === true ? (
            <>
              <Orb />
              <div className="fixed bottom-8 left-1/2 w-max -translate-x-1/2 cursor-default text-muted-foreground/50">
                <AnimatePresence>
                  <motion.div
                    key={"waitingFor"}
                    layout
                    layoutId="waitingFor"
                    className="inline"
                  >
                    Waiting for:{" "}
                  </motion.div>
                  {Object.keys(users).map((uId) =>
                    Object.keys(state.answers ?? {}).includes(uId) ? (
                      ""
                    ) : (
                      <motion.div
                        className="inline"
                        layout
                        layoutId={users[uId]?.id}
                        key={users[uId]?.id}
                        {...blurTransition}
                      >
                        {users[uId]?.username + " "}
                      </motion.div>
                    ),
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <QuizQuestion
              onSubmit={(val) => {
                websocketStore.send({
                  type: "sendMessage",
                  message: { type: "answerQuestion", answer: val },
                });
                const answeredCopy = [...answered];
                answeredCopy[state.question.qNumber] = true;
                setAnswered(answeredCopy);
              }}
              question={state.question}
            />
          )}
        </div>
      </div>
    );
}

// export default function Page() {
//   const status = useSelector(websocketStore, (state) => state.context.status);
//   const users = useSelector(websocketStore, (state) => state.context.users);
//   const messages = useSelector(
//     websocketStore,
//     (state) => state.context.messageHistory,
//   );

//   if (status != "connected") {
//     return (
//       <div className="flex h-full w-full flex-col items-center justify-center">
//         <Button
//           onClick={() => {
//             websocketStore.send({
//               type: "connect",
//               username: `Tester${Math.floor(1000 + Math.random() * 9000)}`,
//               userId: `Tester${Math.floor(1000 + Math.random() * 9000)}`,
//               room: "group-chat",
//             });
//           }}
//           loading={status === "connecting"}
//         >
//           Connect
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-full w-full flex-col items-center justify-center gap-4">
//       {/* <Quiz
//       // debug={process.env.NODE_ENV === "development"}
//       // questions={exampleData}
//       /> */}
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           websocketStore.send({
//             type: "sendMessage",
//             message: {
//               type: "message",
//               content: (
//                 e.currentTarget.elements.namedItem(
//                   "text-box",
//                 ) as HTMLInputElement
//               ).value,
//             },
//           });
//           (
//             e.currentTarget.elements.namedItem("text-box") as HTMLInputElement
//           ).value = "";
//         }}
//         className="flex w-96 gap-2"
//       >
//         <Input id="text-box" placeholder="Type something..." />
//         <Button type="submit" size="icon" className="aspect-square">
//           <IconArrowUp />
//         </Button>
//       </form>
//       <div>{users.map((user) => user.username)}</div>
//       <div>
//         {messages.map((msg) => (
//           <div>
//             {msg.user.username}: {msg.content}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
