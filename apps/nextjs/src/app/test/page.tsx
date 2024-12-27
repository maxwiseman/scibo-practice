"use client";

import { IconArrowUp } from "@tabler/icons-react";
import { useSelector } from "@xstate/store/react";

import { Button } from "@scibo/ui/button";
import { Input } from "@scibo/ui/input";

import { QuizQuestion } from "../_components/quiz/question";
import { Lobby } from "../_components/stages/lobby";
import websocketStore from "../_components/websocket/xstate";

// import { exampleData } from "~/example-data";
// import { Quiz } from "../_components/quiz/quiz";
//
export default function Page() {
  const state = useSelector(websocketStore, (state) => state.context.state);

  if (state.stage === "lobby")
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Lobby />
      </div>
    );
  if (state.stage === "question")
    return (
      <div className="flex h-full min-h-max w-full items-center justify-center p-4">
        <div className="max-w-[60rem]">
          <QuizQuestion onSubmit={() => { }} question={state.question} />
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
