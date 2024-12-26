"use client";

import { QuizQuestion } from "~/app/_components/quiz/question";

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-16">
      <div className="max-w-[60rem]">
        <QuizQuestion
          onSubmit={(e) => {
            console.log(e);
          }}
          question={{
            htmlUrl: "",
            originalText: "",
            bonus: false,
            number: 6,
            qNumber: 6,
            topic: "math",
            type: "multipleChoice",
            // pronunciations: [
            //   "thirty-three and one-third",
            //   "sixty-six and two-thirds",
            // ],
            question:
              "A long-play record rotates at $$33 \\frac{1}{3}$$ revolutions per minute. Which of the following represents this in radians per minute?",
            answer: [
              {
                answer: "$$66 \\frac{2}{3}$$",
                // pronunciations: ["sixty-six and two-thirds"],
                letter: "W",
                correct: true,
              },
              {
                answer: "$$33 \\frac{1}{3}$$",
                // pronunciations: ["thirty-three and one-third"],
                letter: "X",
                correct: false,
              },
              {
                answer: "$$16 \\frac{2}{3}$$",
                // pronunciations: [],
                letter: "Y",
                correct: false,
              },
              {
                answer: "$$6\\pi$$",
                // pronunciations: ["six pi"],
                letter: "Z",
                correct: false,
              },
            ],
            // explanation:
            //   "The correct answer is W) $$66 \\frac{2}{3}$$ because to convert revolutions per minute to radians per minute, you multiply the number of revolutions by $$2\\pi$$ (since there are $$2\\pi$$ radians in one revolution). Thus, $$33 \\frac{1}{3} \\times 2\\pi = 66 \\frac{2}{3}$$.",
          }}
        />
      </div>
    </div>
  );
}
