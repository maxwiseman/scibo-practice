import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@scibo/ui";
import { ThemeProvider, ThemeToggle } from "@scibo/ui/theme";
import { Toaster } from "@scibo/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { Analytics } from "@vercel/analytics/react";

import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://scibo.maxwiseman.io"
      : "http://localhost:3000",
  ),
  title: "Science Bowl Practice",
  description: "Simple app for practicing for the Science Bowl",
  openGraph: {
    title: "Science Bowl Practice",
    description: "Simple app for practicing for the Science Bowl",
    url: "https://scibo.maxwiseman.io",
    siteName: "Science Bowl Practice",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@maxwiseman_",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "h-full bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Analytics />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          {env.NODE_ENV === "development" && (
            <div className="absolute bottom-4 right-4">
              <ThemeToggle />
            </div>
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
