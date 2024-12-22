import type { MotionProps } from "motion/react";

export const blurTransition: MotionProps = {
  exit: {
    // y: -25,
    opacity: 0,
    filter: "blur(10px)",
    scale: 0.9,
    transition: { ease: "easeIn", duration: 0.3 },
  },
  initial: { opacity: 0, scale: 0.95, filter: "blur(5px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.3, delay: 0.3 },
  },
};
