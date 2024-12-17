import type { HTMLProps } from "react";

import { cn } from "@scibo/ui";

import styles from "./orb.module.css";

export function Orb({
  blur,
  sharp,
  className,
  ...props
}: {
  blur?: "lg" | "xl" | "2xl" | "3xl";
  sharp?: boolean;
} & HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex aspect-square w-44 items-center justify-center overflow-hidden rounded-full",
        { "blur-2xl": sharp !== true },
        {
          "blur-lg": blur === "lg" && sharp !== true,
          "blur-xl": blur === "xl" && sharp !== true,
          "blur-2xl": blur === "2xl" && sharp !== true,
          "blur-3xl": blur === "3xl" && sharp !== true,
        },
        className,
      )}
      {...props}
    >
      {/* <div className={styles.mask} /> */}
      <div
        className={cn(
          styles.container,
          "container grid place-content-center place-items-center",
          {
            "blur-lg": blur === "lg" && sharp === true,
            "blur-xl": blur === "xl" && sharp === true,
            "blur-2xl": blur === "2xl" && sharp === true,
            "blur-3xl": blur === "3xl" && sharp === true,
          },
        )}
      >
        <div style={{ gridRow: 1, gridColumn: 1 }} />
        <div style={{ gridRow: 1, gridColumn: 1 }} />
        <div style={{ gridRow: 1, gridColumn: 1 }} />
        <div style={{ gridRow: 1, gridColumn: 1 }} />
        <div style={{ gridRow: 1, gridColumn: 1 }} />
        <div style={{ gridRow: 1, gridColumn: 1 }} />
      </div>
    </div>
  );
}
