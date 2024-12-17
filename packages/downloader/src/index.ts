import fs from "fs";
import https from "https";
import type { PDFExtractPage } from "pdf.js-extract";
import type { LaunchOptions } from "puppeteer-core";
// import { $ } from "bun";
import { PDFExtract } from "pdf.js-extract";
import puppeteer from "puppeteer-core";

import { db } from "@scibo/db/client";
import { Question } from "@scibo/db/schema";

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
const updateDB = process.argv.includes("--db");

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

type sciboTopic =
  | "biology"
  | "physics"
  | "math"
  | "earth science"
  | "earth and space"
  | "energy"
  | "general science"
  | "astronomy"
  | "chemistry";
interface questionData {
  bonus: boolean;
  number: number;
  topic: sciboTopic;
  type: "shortAnswer" | "multipleChoice";
  question: string;
  answer: string | { answer: string; letter: string; correct: boolean }[];
  htmlUrl: string;
  originalText: string;
}

let totalData: Partial<questionData>[] = [];

if (updateDB) await db.delete(Question);

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

      const regex =
        /.*(?<type>TOSS.UP|BONUS)\s*(?<number>\d+)[).]\s*(?<topic>[A-z\s]+)\s*.?\s+(?<type2>Short [Aa]nswer|Multiple [Cc]hoice)[.]?\s*(?<question>.*?)ANSWER. (?<answer>.*)/;
      const mcqRegex =
        /.*(?<type>TOSS.UP|BONUS)\s*(?<number>\d+)[).]\s*(?<topic>[A-z\s]+)\s*.?\s+(?<type2>Short [Aa]nswer|Multiple [Cc]hoice)[.]?\s*(?<question>.*?)[A-Z]\).*ANSWER. (?<answer>.*)/;

      const mcqAnswerRegex =
        /(?<letter>[W-Zw-z1-4])\) (?<answer>[^X]*?)(?=\s*[A-Z]\)|$)/g;

      const formatted = questions.map((q) => {
        const groups = regex.exec(q)?.groups;
        let data: Partial<questionData> = {
          bonus: groups?.type === "BONUS",
          number: parseInt(groups?.number ?? ""),
          topic: groups?.topic?.toLowerCase().trim() as sciboTopic,
          type:
            groups?.type2 === "Short Answer" ? "shortAnswer" : "multipleChoice",
          question: groups?.question,
          answer: groups?.answer,
          htmlUrl: `${hrefs[i]}#page=${pageNum + 1}`,
          originalText: q,
        };

        if (data.type == "multipleChoice") {
          const mcqMatches = data.question?.matchAll(mcqAnswerRegex);
          // const mcqMatches = groups?.choices?.matchAll(mcqAnswerRegex);
          if (mcqMatches === undefined) return data;
          const mcqQuestions = Array.from(mcqMatches)
            .map((q) => q.groups)
            .map((i) => ({
              answer: i?.answer ?? "",
              letter: i?.letter ?? "",
              correct:
                groups?.answer?.replace(/[A-Z]\) /, "").toLowerCase() ==
                i?.answer?.toLowerCase(),
            }));
          const mcqGroups = mcqRegex.exec(q)?.groups;
          data = {
            ...data,
            answer: mcqQuestions,
            question: mcqGroups?.question,
          };
        }
        return data;
      });
      if (updateDB)
        await db
          .insert(Question)
          .values(
            formatted.filter(
              (item) =>
                item.answer !== undefined &&
                item.bonus !== undefined &&
                item.htmlUrl !== undefined &&
                item.number !== undefined &&
                item.originalText !== undefined &&
                item.question !== undefined &&
                item.topic !== undefined &&
                item.type !== undefined,
            ) as questionData[],
          );
      totalData = [...totalData, ...formatted];
    }

    console.log(`Closed set ${i}`);
  } catch (err) {
    console.error("Something went wrong!", err);
    // i--;
  }
}
// await Bun.write("./data.json", JSON.stringify(totalData));
fs.writeFileSync("./data.json", JSON.stringify(totalData));
console.log(`Downloaded ${totalData.length} questions`);
