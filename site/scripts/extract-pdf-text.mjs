// One-shot: extract text from Franc's SmartCredit PDF and write it to a .txt file.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const PDF = "C:/Users/franc/Downloads/3-Bureau Credit Report & Scores _ SmartCredit3.pdf";
const OUT = "C:/Users/franc/Projects/websites/phimindflow-site/site/scripts/_smartcredit-extracted.txt";

const buf = readFileSync(PDF);
const parser = new PDFParse({ data: buf });
const result = await parser.getText();
const text = result.text || result.pages?.map((p) => p.text).join("\n\n") || "";
writeFileSync(OUT, text, "utf8");
console.log(`✅ Extracted ${result.pages?.length ?? "?"} pages, ${text.length} chars → ${OUT}`);
