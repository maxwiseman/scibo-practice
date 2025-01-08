"use client";

import { useEffect } from "react";
import { useCompletion } from "ai/react";

// This is just a little easter-egg
// Basically if your username contains certain gen-z slang, you get roasted by ai
export const slang = [
  "rizz",
  "skibidi",
  "sigma",
  "fanum",
  "yap",
  "aura",
  "cooked",
  "bop",
  "glaze",
  "mew",
  "edge",
  "sus",
  "diddy",
  "pookie",
  "goat",
  "delulu",
  "pause",
  "npc",
  "beta",
  "alpha",
  "mog",
  "brat",
  "ohio",
  "hawk",
  "tuah",
  "spit on",
  "huzz",
  "chuzz",
  "gyat",
];
export const slangCheck = (i: string) =>
  slang.some((word) => i.toLowerCase().includes(word));

export function UsernameResponse({
  username,
  forceVisible = false,
}: {
  username: string;
  forceVisible?: boolean;
}) {
  const { completion, complete, isLoading } = useCompletion({
    api: "/api/ai/username",
  });
  let completing = false;

  useEffect(() => {
    if (!isLoading && !completing) {
      completing = true;
      complete(username);
      console.log("Completing");
    }
  }, [username]);

  if ((completion === "" || completion === undefined) && forceVisible === false)
    return null;

  return (
    <blockquote className="mt-6 w-full max-w-prose border-l-2 pl-6 text-muted-foreground">
      {completion}
      {isLoading && <span className="not-italic">█</span>}
      <br />
      <br />
      <span className="font-medium not-italic">
        —ChatGPT, {new Date().getFullYear()}
      </span>
    </blockquote>
  );
}
