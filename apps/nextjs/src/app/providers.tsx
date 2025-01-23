"use client";

import type { ReactNode } from "react";

import { TooltipProvider } from "@scibo/ui/tooltip";

export function Providers({ children }: { children: ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
