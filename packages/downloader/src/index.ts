import fs, { appendFileSync } from "fs";
import https from "https";
import type OpenAI from "openai";
import type { PDFExtractPage } from "pdf.js-extract";
import type { LaunchOptions } from "puppeteer-core";
import { zodResponseFormat } from "openai/helpers/zod";
// import { $ } from "bun";
import { PDFExtract } from "pdf.js-extract";
import puppeteer from "puppeteer-core";
import { z } from "zod";

import { QuestionDataSchema } from "./format";
import { systemPrompt } from "./prompts";

const numbers = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];

async function downloadPDF(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const fileStream = fs.createWriteStream(outputPath);

        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          console.log("Download completed");
          resolve();
        });

        fileStream.on("error", (err) => {
          fileStream.close();
          reject(err);
        });

        response.on("error", (err) => {
          fileStream.close();
          reject(err);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}
function checkFileExists(filePath: string) {
  try {
    // Using fs.accessSync to check file existence
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const args = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-infobars",
  "--window-position=0,0",
  "--ignore-certifcate-errors",
  "--ignore-certifcate-errors-spki-list",
  '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
];
const options: LaunchOptions = {
  args: args,
  headless: true,
  //userDataDir: "/Users/maxwiseman/Library/Application Support/Google/Chrome",
  userDataDir: "./tmp",
  executablePath:
    process.platform === "win32"
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : process.platform === "linux"
        ? "/snap/bin/chromium"
        : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
};
const pdfExtract = new PDFExtract();

console.log("Starting...");
const browser = await puppeteer.launch(options);
const context = await browser.createBrowserContext({});
const page = await context.newPage();

await page.goto(
  "https://science.osti.gov/wdts/nsb/Regional-Competitions/Resources/HS-Sample-Questions",
);
console.log("Page loaded");

const hrefs = (
  await page.$$eval("a.pdf", (e) =>
    e.map((element) => (element as { href: string }).href),
  )
).filter(
  (val) =>
    typeof val === "string" &&
    val !==
      "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-3/Energy-Category.pdf",
);

await browser.close();

// type sciboTopic =
//   | "biology"
//   | "physics"
//   | "math"
//   | "earth science"
//   | "earth and space"
//   | "energy"
//   | "general science"
//   | "astronomy"
//   | "chemistry";
// interface questionData {
//   bonus: boolean;
//   number: number;
//   topic: sciboTopic;
//   type: "shortAnswer" | "multipleChoice";
//   question: string;
//   answer: string | { answer: string; letter: string; correct: boolean }[];
//   htmlUrl: string;
//   originalText: string;
// }

let questionCount = 0;

for (let i = 0; i < hrefs.length; i++) {
  const alreadyExists = checkFileExists(`./data/${i}.pdf`);
  if (!alreadyExists) {
    // await $`curl -o ./data/${i}.pdf ${hrefs[i]}`;
    console.log(`Downloading ${i}.pdf`);
    await downloadPDF(hrefs[i] ?? "", `./data/${i}.pdf`);
  }
  const url = `./data/${i}.pdf`;

  try {
    console.log(`Opening set ${i}`);
    let pages: PDFExtractPage[] = [];
    const data = await pdfExtract.extract(url, { normalizeWhitespace: true });
    pages = data.pages;
    for (let pageNum = 0; pageNum < pages.length; pageNum++) {
      let totalText = "";
      totalText =
        pages[pageNum]?.content.flatMap((content) => content.str).join("") ??
        "";
      const questions = totalText
        .replaceAll(/High School\s*.\s*Round\s*\d+\s*\w?\s*Page\s*\d+/gi, "")
        .replaceAll(/Round\s*Robin\s*~?\s*Round\s*~?\s*\d+/gi, "")
        .replaceAll(/\d*\s*Regional\s*Science\s*Bowl\s*.?/gi, "")
        .replaceAll(/Double\s*Elimination\s*~?\s*Round\s*~?\s*\d+/gi, "")
        .replaceAll(/\d*\s*NSB.\s*Regional\s*High\s*School\s*Questions/gi, "")
        .replaceAll(/\d*\s*Regional\s*High\s*School\s*NSB.\s*/gi, "")
        .replaceAll(/\d*\s*Regional\s*Science\s*Bowl\s*.\s*/gi, "")
        .replaceAll(/\s*Round \d*\s*[A-O]?\s*/gi, "")
        .replaceAll(/\s*Page\s*\d+/gi, "")
        .split(/[~_]*(?=BONUS|TOSS.?UP)[~_]*/);
      console.log(pageNum);

      questions.forEach((q) => {
        const content: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
          {
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: q },
            ],
            temperature: 0,
            max_tokens: 2000,
            response_format: zodResponseFormat(
              z.object({ questions: z.array(QuestionDataSchema) }),
              "question-parser",
            ),
          };
        appendFileSync(
          `./batches/${numbers[Math.floor(questionCount / 1000)]}.jsonl`,
          `${JSON.stringify({ custom_id: `${hrefs[i]}-=-${pageNum}-=-${questionCount}`, method: "POST", url: "/v1/chat/completions", body: content }).replaceAll(/[\r\n]+/g, "")}\n`,
        );
        questionCount++;
      });
    }

    console.log(`Closed set ${i}`);
  } catch (err) {
    console.error("Something went wrong!", err);
    // i--;
  }
}

console.log(`Added ${questionCount} questions to the batch`);
// fs.writeFileSync("./batch.jsonl", JSON.stringify(totalData));
