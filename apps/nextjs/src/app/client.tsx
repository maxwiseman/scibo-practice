"use client";

import type { questionSelect } from "@scibo/db/schema";
import { AnimatePresence } from "motion/react";
import { Suspense, unstable_ViewTransition as ViewTransition } from "react";
import type z from "zod";
import { Orb } from "~/components/orb";
import { Question } from "~/components/question";

export function HomeClient({
  data,
}: {
  data: Promise<z.infer<typeof questionSelect> | undefined>;
}) {
  return (
    <div className="w-full flex justify-center">
      <AnimatePresence>
        <Suspense
          fallback={
            <ViewTransition>
              <Orb className="scale-150" />
            </ViewTransition>
          }
        >
          <ViewTransition>
            <Question className="max-w-4xl w-full" data={data} />
          </ViewTransition>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}
