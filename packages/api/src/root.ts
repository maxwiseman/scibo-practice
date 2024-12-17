import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { quizRouter } from "./router/quiz";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  quiz: quizRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
