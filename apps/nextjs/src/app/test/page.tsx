import { AnimatePresence, motion } from "motion/react";

import { exampleData } from "~/example-data";
import { Quiz } from "../_components/quiz";

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-16">
      <AnimatePresence>
        <Quiz
          // debug={process.env.NODE_ENV === "development"}
          questions={exampleData}
        />
      </AnimatePresence>
    </div>
  );
}