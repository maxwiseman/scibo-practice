"use client";

import {
  IconCrown,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useSelector } from "@xstate/store/react";

import { cn } from "@scibo/ui";
import { Button } from "@scibo/ui/button";
import { Card, CardContent, CardHeader } from "@scibo/ui/card";
import { Input } from "@scibo/ui/input";
import { Label } from "@scibo/ui/label";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTrigger,
} from "@scibo/ui/responsive-dialog";
import { Switch } from "@scibo/ui/switch";

import websocketStore from "../websocket/xstate";

export function Lobby() {
  const status = useSelector(websocketStore, (state) => state.context.status);
  const users = useSelector(websocketStore, (state) => state.context.users);
  const self = useSelector(
    websocketStore,
    (state) => state.context.currentUser,
  );

  if (status !== "connected" || self === null)
    return (
      <Card className="w-96">
        <CardHeader className="text-xl font-semibold">
          SciBo Multiplayer
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              websocketStore.send({
                type: "connect",
                username: (
                  e.currentTarget.elements.namedItem(
                    "uname",
                  ) as HTMLInputElement
                ).value,
                userId: (
                  e.currentTarget.elements.namedItem(
                    "uname",
                  ) as HTMLInputElement
                ).value,
                room: (
                  e.currentTarget.elements.namedItem("code") as HTMLInputElement
                ).value,
              });
            }}
            className="flex flex-col gap-2"
          >
            <Input
              id="uname"
              placeholder="Username"
              disabled={status === "connecting"}
            />
            <Input
              id="code"
              placeholder="Game Code"
              disabled={status === "connecting"}
            />
            <Button
              loading={status === "connecting"}
              className="mt-4"
              type="submit"
            >
              Connect
            </Button>
          </form>
        </CardContent>
      </Card>
    );

  return (
    <div className="flex flex-col items-center gap-8">
      <Card className="w-[48rem] max-w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <h1 className="text-xl font-semibold">Lobby</h1>

            <h2 className="text-sm text-muted-foreground">
              {self.role === "host"
                ? "Click on a user to kick them"
                : "Waiting for the host to start the game..."}
            </h2>
          </div>
          <div className="flex gap-1">
            {self.role === "host" && (
              <GameSettingsDialog>
                <Button size="icon" variant="outline" icon={<IconSettings />} />
              </GameSettingsDialog>
            )}
            <Button
              onClick={() => {
                websocketStore.send({ type: "disconnect" });
              }}
              size="icon"
              variant="outline"
              icon={<IconLogout />}
            />
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-4 gap-2 gap-x-4">
          {new Array(24).fill(null).map((_, i) => (
            <Button
              variant="secondary"
              disabled={
                users[i] === undefined ||
                (users[i].role === "host" && self.role === "host")
              }
              onClick={() => {
                websocketStore.send({
                  type: "sendMessage",
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  message: { type: "kickUser", userId: users[i]!.id },
                });
              }}
              className={cn({ "cursor-default": self.role !== "host" })}
            >
              <div className="flex w-full max-w-full items-center justify-between gap-2">
                <span
                  style={{
                    maskImage:
                      "linear-gradient(-90deg, #000, #000, transparent 0, #000 10px)",
                  }}
                  className="line-clamp-1 w-full max-w-full text-left"
                >
                  {users[i]?.username}
                </span>
                <div className="flex min-w-max gap-2">
                  {users[i]?.id === self.id && <IconUser className="h-4 w-4" />}
                  {users[i]?.role === "host" && (
                    <IconCrown className="h-4 w-4" />
                  )}
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
      {self.role === "host" && <Button className="w-max">Start Game</Button>}
    </div>
  );
}

export function GameSettingsDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader className="text-xl font-semibold">
          Game Settings
        </ResponsiveDialogHeader>
        <form className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <LabeledSwitch
              onChange={(e) => {
                console.log(e);
              }}
              checked={false}
              label="Testing"
            />
          </div>
          <Button>Save</Button>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

function LabeledSwitch({
  label,
  onChange,
  checked,
}: {
  label?: string;
  onChange?: (checked: boolean) => void;
  checked?: boolean;
}) {
  return (
    <Label className="flex items-center gap-3 text-base">
      <Switch checked={checked} onCheckedChange={onChange} />
      {label}
    </Label>
  );
  // return (
  //   <div className="flex w-max items-center justify-between gap-3">
  //     <Switch onChange={onChange} />
  //     {label && <Label>{label}</Label>}
  //   </div>
  // );
}
