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
      answer: {
        answer: string;
        letter: string;
        correct: boolean;
        pronunciations: string[];
      }[];
      htmlUrl: string;
      explanation: string;
      valid: boolean;
      pronunciations: string[];
    }
  | {
      bonus: boolean;
      number: number;
      topic: sciboTopic;
      type: "shortAnswer";
      question: string;
      answer: string;
      htmlUrl: string;
      explanation: string;
      valid: boolean;
      pronunciations: string[];
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
