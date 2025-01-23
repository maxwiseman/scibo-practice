"use client";

import type { ReactNode } from "react";
import NumberFlow from "@number-flow/react";
import { useSelector } from "@xstate/store/react";
import { motion } from "motion/react";

import { cn } from "@scibo/ui";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@scibo/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@scibo/ui/tooltip";

import websocketStore from "./websocket/xstate";

export function LeaderboardModal({ children }: { children: ReactNode }) {
  const users = useSelector(websocketStore, (state) => state.context.users);
  const self = useSelector(
    websocketStore,
    (state) => state.context.currentUser,
  );

  return (
    <Dialog>
      <DialogTrigger>
        <Tooltip>
          <TooltipContent side="bottom" align="end">
            Leaderboard
          </TooltipContent>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Leaderboard</DialogTitle>
        <div className="flex w-full max-w-[35rem] flex-col gap-2">
          {Object.entries(users)
            .sort(([_, userData1], [__, userData2]) =>
              userData1.role !== "spectator" && userData2.role !== "spectator"
                ? userData2.score - userData1.score
                : 0,
            )
            .map(([uId, userData], i) =>
              userData.role === "spectator" ? null : (
                <motion.div
                  layout
                  key={userData.id}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-md bg-muted px-4 py-2 text-2xl",
                    { "text-muted-foreground": uId !== self?.id },
                  )}
                >
                  <div className="flex gap-2">
                    <div className="text-muted-foreground">{`#${i + 1}`}</div>
                    <div>{userData.username}</div>
                  </div>
                  <motion.div layoutRoot>
                    <NumberFlow
                      value={userData.score}
                      className="text-muted-foreground"
                    />
                  </motion.div>
                </motion.div>
              ),
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
