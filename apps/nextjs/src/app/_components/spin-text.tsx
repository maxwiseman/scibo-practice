import { HTMLProps } from "react";
import { AnimatePresence, motion, MotionProps } from "motion/react";
import { onlyText } from "react-children-utilities";

import { cn } from "@scibo/ui";

export function SpinText({
  children,
  className,
  textClassName,
}: {
  children?: React.ReactNode;
  textClassName?: string;
} & HTMLProps<HTMLDivElement>) {
  const transition = { duration: 0.5, ease: "easeInOut" };
  const gradientLength = 1;

  const scrollAnimation: Partial<MotionProps> = {
    animate: { translateY: "0%" },
    exit: { translateY: `calc(-100% - ${gradientLength}rem)` },
    initial: { translateY: `calc(100% + ${gradientLength}rem)` },
  };
  const rotateAnimation: Partial<MotionProps> = {
    animate: { rotateX: "0deg" },
    exit: { rotateX: "-90deg" },
    initial: { rotateX: "90deg" },
  };
  const key = onlyText(children);

  return (
    <div
      style={{
        maskImage: `linear-gradient(transparent 0,#000 ${gradientLength}rem,#000 calc(100% - ${gradientLength}rem),transparent)`,
        paddingTop: `${gradientLength}rem`,
        paddingBottom: `${gradientLength}rem`,
      }}
      className={cn(
        "relative grid grid-cols-1 place-content-center place-items-center",
        className,
      )}
    >
      <AnimatePresence>
        <motion.div
          style={{
            gridColumn: "1 / 1",
            gridRow: "1 / 1",
            transformOrigin: "50% 50% 30px",
            perspective: "10px",
            backfaceVisibility: "hidden",
          }}
          className={cn(
            "absolute flex h-full w-full place-content-center place-items-center",
            textClassName,
          )}
          animate={rotateAnimation.animate}
          exit={rotateAnimation.exit}
          initial={rotateAnimation.initial}
          transition={transition}
          key={key}
        >
          <div>{children}</div>
        </motion.div>
        <motion.div
          animate={scrollAnimation.animate}
          exit={scrollAnimation.exit}
          initial={scrollAnimation.initial}
          key={`${key}-2`}
          style={{
            gridColumn: "1 / 1",
            gridRow: "1 / 1",
            opacity: "0",
            zIndex: "-1000",
          }}
          transition={transition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
