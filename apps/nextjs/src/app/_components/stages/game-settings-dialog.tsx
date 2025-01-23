"use client";

import * as React from "react";
import {
  IconHandStop,
  IconScoreboard,
  IconSettings,
  IconStopwatch,
} from "@tabler/icons-react";
import { useDebounce } from "@uidotdev/usehooks";
import { useSelector } from "@xstate/store/react";
import _ from "lodash";
import { z } from "zod";

import { gameSettingsSchema } from "@scibo/multiplayer-server/shared";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@scibo/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@scibo/ui/dialog";
import { Input } from "@scibo/ui/input";
import { Label } from "@scibo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@scibo/ui/select";
import { Separator } from "@scibo/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@scibo/ui/sidebar";
import { Switch } from "@scibo/ui/switch";

import websocketStore from "../websocket/xstate";

const data = {
  nav: [
    { name: "General", icon: IconSettings },
    { name: "Timing", icon: IconStopwatch },
    { name: "Scoring", icon: IconScoreboard },
    { name: "Ending", icon: IconHandStop },
  ],
};

export function GameSettingsDialog({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("General");
  const self = useSelector(
    websocketStore,
    (state) => state.context.currentUser,
  );
  const gameSettingsStore = useSelector(
    websocketStore,
    (state) => state.context.settings,
  );
  const [gameSettings, setGameSettings] = React.useState(gameSettingsStore);
  const debouncedGameSettingsState = useDebounce(gameSettings, 0);

  React.useEffect(() => {
    if (gameSettingsStore !== gameSettings)
      websocketStore.send({
        type: "sendMessage",
        message: {
          type: "updateGameSettings",
          settings: debouncedGameSettingsState,
        },
      });
  }, [debouncedGameSettingsState]);
  React.useEffect(() => {
    setGameSettings(gameSettingsStore);
  }, [gameSettingsStore]);

  const updateState = (
    newValues: DeepPartial<z.infer<typeof gameSettingsSchema>>,
  ) => {
    setGameSettings((prevState) => _.merge({}, prevState, newValues)); // One-liner for deep merge
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[calc(100%-6rem)] max-w-[calc(100%-6rem)] overflow-hidden p-0 md:h-[500px] md:w-[700px] lg:w-[1000px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className="h-full max-h-full min-h-0 items-start">
          <Sidebar className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          onClick={() => {
                            setActiveTab(item.name);
                          }}
                          className="cursor-pointer"
                          isActive={item.name === activeTab}
                        >
                          <div>
                            <item.icon />
                            <span>{item.name}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-full max-h-full flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="md:hidden" />
                <Separator
                  className="mr-2 h-5 md:hidden"
                  orientation="vertical"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink
                        onClick={() => {
                          setActiveTab("General");
                        }}
                        className="cursor-pointer"
                      >
                        Settings
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="cursor-default">
                        {activeTab}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {activeTab === "General" && (
                <GameSettingsGeneral
                  host={self?.role === "host"}
                  gameSettings={gameSettings}
                  setGameSettings={updateState}
                />
              )}
              {activeTab === "Timing" && (
                <GameSettingsTiming
                  host={self?.role === "host"}
                  gameSettings={gameSettings}
                  setGameSettings={updateState}
                />
              )}
              {activeTab === "Scoring" && (
                <GameSettingsScoring
                  host={self?.role === "host"}
                  gameSettings={gameSettings}
                  setGameSettings={updateState}
                />
              )}
              {activeTab === "Ending" && (
                <GameSettingsEnding
                  host={self?.role === "host"}
                  gameSettings={gameSettings}
                  setGameSettings={updateState}
                />
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}

export function SettingsField({
  children,
  label,
  description,
}: {
  children?: React.ReactNode;
  label?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
      <p className="text-[0.8rem] text-muted-foreground">{description}</p>
    </div>
  );
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export function GameSettingsGeneral({
  gameSettings,
  setGameSettings,
  host,
}: {
  gameSettings: z.infer<typeof gameSettingsSchema>;
  setGameSettings: (
    arg0: DeepPartial<z.infer<typeof gameSettingsSchema>>,
  ) => void;
  host?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SettingsField label="Max Players">
        <Input
          type="number"
          onChange={(e) => {
            setGameSettings({
              general: {
                maxPlayers: parseInt(e.target.value),
              },
            });
          }}
          value={gameSettings.general.maxPlayers.toString()}
          placeholder="Type something..."
          disabled={host === false}
        />
      </SettingsField>
    </div>
  );
}

export function GameSettingsTiming({
  gameSettings,
  setGameSettings,
  host,
}: {
  gameSettings: z.infer<typeof gameSettingsSchema>;
  setGameSettings: (
    arg0: DeepPartial<z.infer<typeof gameSettingsSchema>>,
  ) => void;
  host?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SettingsField label="Enable Timing">
        <Switch
          checked={gameSettings.timing.enabled}
          onCheckedChange={(val) => {
            setGameSettings({ timing: { enabled: val } });
          }}
          disabled={host === false}
        />
      </SettingsField>
      <SettingsField label="Toss Up Time">
        <Input
          type="number"
          onChange={(e) => {
            setGameSettings({
              timing: {
                time: parseInt(e.target.value),
              },
            });
          }}
          value={gameSettings.timing.time.toString()}
          placeholder="Type something..."
          disabled={host === false}
        />
      </SettingsField>
      <SettingsField label="Bonus Time">
        <Input
          type="number"
          onChange={(e) => {
            setGameSettings({
              timing: {
                bonusTime: parseInt(e.target.value),
              },
            });
          }}
          value={gameSettings.timing.bonusTime.toString()}
          placeholder="Type something..."
          disabled={host === false}
        />
      </SettingsField>
    </div>
  );
}

export function GameSettingsScoring({
  gameSettings,
  setGameSettings,
  host,
}: {
  gameSettings: z.infer<typeof gameSettingsSchema>;
  setGameSettings: (
    arg0: DeepPartial<z.infer<typeof gameSettingsSchema>>,
  ) => void;
  host?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SettingsField label="Toss Up Points">
        <Input
          type="number"
          onChange={(e) => {
            setGameSettings({
              scoring: {
                correct: parseInt(e.target.value),
              },
            });
          }}
          value={gameSettings.scoring.correct.toString()}
          placeholder="Type something..."
          disabled={host === false}
        />
      </SettingsField>
      <SettingsField label="Bonus Points">
        <Input
          type="number"
          onChange={(e) => {
            setGameSettings({
              scoring: {
                bonus: parseInt(e.target.value),
              },
            });
          }}
          value={gameSettings.scoring.bonus.toString()}
          placeholder="Type something..."
          disabled={host === false}
        />
      </SettingsField>
    </div>
  );
}

export function GameSettingsEnding({
  gameSettings,
  setGameSettings,
  host,
}: {
  gameSettings: z.infer<typeof gameSettingsSchema>;
  setGameSettings: (
    arg0: DeepPartial<z.infer<typeof gameSettingsSchema>>,
  ) => void;
  host?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SettingsField label="Ending Type">
        <Select
          onValueChange={(e) => {
            setGameSettings({
              end: {
                type: e as "time" | "questions",
              },
            });
          }}
          value={gameSettings.end.type.toString()}
          disabled={host === false}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select one..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="time">Time</SelectItem>
            <SelectItem value="questions">Question Count</SelectItem>
          </SelectContent>
        </Select>
      </SettingsField>
      {gameSettings.end.type === "time" ? (
        <SettingsField label="Max Time (mins)">
          <Input
            type="number"
            onChange={(e) => {
              setGameSettings({
                end: {
                  maxTime:
                    parseInt(e.target.value === "" ? "0" : e.target.value) ?? 0,
                },
              });
            }}
            min={1}
            value={gameSettings.end.maxTime?.toString()}
            placeholder="Type something..."
            disabled={host === false}
          />
        </SettingsField>
      ) : (
        <SettingsField label="Max Questions">
          <Input
            type="number"
            onChange={(e) => {
              setGameSettings({
                end: {
                  maxQuestions:
                    parseInt(e.target.value === "" ? "0" : e.target.value) ?? 0,
                },
              });
            }}
            min={1}
            value={gameSettings.end.maxQuestions?.toString()}
            placeholder="Type something..."
            disabled={host === false}
          />
        </SettingsField>
      )}
    </div>
  );
}
