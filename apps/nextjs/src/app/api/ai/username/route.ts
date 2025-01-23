import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// This is used in username-response.tsx
// It's just a little easter-egg
// Basically if your username contains certain gen-z slang, you get roasted by ai
export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    // I mean if they're using skibidi in their username, they deserve it
    system: `You're a snarky AI assitant. Come up with a funny answer. You're encouraged to use foul or vulgar language, insult people, or whatever you want. Curse words are also encouraged. You will be given a username that some user tried to use for a science bowl practice app. They're about to compete in the multiplayer practice mode. Come up with a snarky and funny response insulting and their username. Here are the meanings for some popular slang words if it helps: ${formatNeededDefinitions(prompt)}`,
    temperature: 1,
    prompt,
  });

  return result.toDataStreamResponse();
}

// WARNING! Do not look at the following code if you would like to retain any shred of your intelligence
// These definitions came from the internet, and an AI, so don't blame me
type wordDefinition = { meaning: string; usage?: string };
const allDefinitions: Record<string, wordDefinition> = {
  brat: {
    meaning: "Enjoying life as much as you can, 365 party girl",
    usage: "This is gonna be a brat summer",
  },
  bussin: { meaning: "Delicious", usage: "That food was bussin' bro" },
  cap: { meaning: "Lie", usage: "No cap bro" },
  cheugy: { meaning: "Opposite of trendy" },
  delulu: { meaning: "Delusional" },
  demure: { meaning: "Elegant, understated", usage: "Very demure" },
  gyat: {
    // For the record, I'm not trying to be insensitive or vulgar here, this prompt just gives good results
    meaning: "refers to a large ass",
    usage: "Livvy's got a huge gyatt",
  },
  "just put the fries in the bag bro": { meaning: "Insult", usage: "" },
  "Livvy Dunne": {
    meaning: "an attractive gymnist who goes to LSU",
    usage: "Livvy Dunne rizzed up Baby Gronk",
  },
  "Baby Gronk": {
    meaning: "a child influencer who plays football",
    usage: "Livvy Dunne rizzed up Baby Gronk",
  },
  mewing: {
    meaning: "An activity meant to accentuate your jawline",
    usage: "Have you tried mewing?",
  },
  NPC: { meaning: "Non-playable character", usage: "Bro is such an NPC" },
  Ohio: {
    meaning: "Strange, weird, cringy or innocuous",
    usage: "Only in ohio",
  },
  rizz: {
    meaning: "Short for charisma (game)",
    usage: "Bro has some serious rizz; He just rizzed her up",
  },
  sigma: {
    meaning: "Cool, also has toxic male connotations",
    usage: "You're such a sigma",
  },
  skibidi: {
    meaning:
      "An adjective that can mean cool, dumb or bad; Originates from videos of a toilet with a head coming out",
    usage: "That's so skibidi",
  },
  cooked: {
    meaning: "has no chance",
    usage: "Bro I am so cooked on this test",
  },
  yap: {
    meaning: "talking a lot",
    usage: "This teacher is just yaps for hours",
  },
  aura: {
    meaning: "a score for someone's game",
    usage: "Ooh, +9000 aura for that one",
  },
};

function formatDefinitions(
  definitions: Record<string, wordDefinition> | undefined = allDefinitions,
) {
  const formattedArray = Object.entries(definitions).map(
    ([word, obj]) =>
      `${word}: ${obj.meaning}${obj.usage ? ` (ex. ${obj.usage})` : ""}`,
  );
  return formattedArray.join("\n");
}

function formatNeededDefinitions(
  input: string,
  definitions: Record<string, wordDefinition> | undefined = allDefinitions,
) {
  const output: Record<string, wordDefinition> = {};
  Object.entries(definitions).forEach(([word, obj]) => {
    if (input.toLowerCase().includes(word.toLowerCase())) {
      output[word] = obj;
    }
  });
  return formatDefinitions(output);
}
