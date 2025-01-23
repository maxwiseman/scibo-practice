"use client";

import { useSelector } from "@xstate/store/react";

import { Lobby } from "../_components/stages/lobby";
import { Question } from "../_components/stages/question";
import { Results } from "../_components/stages/results";
import websocketStore from "../_components/websocket/xstate";

export default function Page() {
  const state = useSelector(websocketStore, (state) => state.context.state);
  const status = useSelector(websocketStore, (state) => state.context.status);

  if (state.stage === "lobby" || status !== "connected")
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <Lobby />
      </div>
    );
  if (state.stage === "question")
    return (
      <div className="flex h-full min-h-max w-full items-center justify-center p-4">
        <Question />
      </div>
    );
  if (state.stage === "results")
    return (
      <div className="flex h-full min-h-max w-full items-center justify-center p-4">
        <Results />
      </div>
    );
}
