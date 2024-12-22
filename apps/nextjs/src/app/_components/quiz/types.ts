export type sciboTopic =
  | "biology"
  | "physics"
  | "math"
  | "earth science"
  | "earth and space"
  | "energy"
  | "general science"
  | "astronomy"
  | "chemistry";
export type sciboQuestion =
  | {
      bonus: boolean;
      number: number;
      topic: sciboTopic;
      type: "multipleChoice";
      question: string;
      answer: { answer: string; letter: string; correct: boolean }[];
      htmlUrl: string;
      originalText: string;
    }
  | {
      bonus: boolean;
      number: number;
      topic: sciboTopic;
      type: "shortAnswer";
      question: string;
      answer: string;
      htmlUrl: string;
      originalText: string;
    };
// export interface sciboQuestion {
//   bonus: boolean;
//   number: number;
//   topic: sciboTopic;
//   type: "multipleChoice" | "shortAnswer";
//   question: string;
//   answer: string | { answer: string; letter: string; correct: boolean }[];
//   htmlUrl: string;
//   originalText: string;
// }
