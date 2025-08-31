// import { exampleData } from "~/example-data";
import { Quiz } from "./_components/quiz/quiz";

// export const runtime = "edge";

export default function Page() {
  // void api.quiz.getQuestion.prefetch();

  return (
    <div className="flex h-full min-h-max w-full flex-col items-center justify-center gap-16">
      <Quiz
      // debug={env.NODE_ENV === "development"}
      // questions={exampleData}
      />
    </div>
  );
}
