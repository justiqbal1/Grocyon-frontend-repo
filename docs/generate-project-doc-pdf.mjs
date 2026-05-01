import fs from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const inputPath = path.resolve("docs/Grocyon-Project-Operational-Documentation.md");
const outputPath = path.resolve("docs/Grocyon-Project-Operational-Documentation.pdf");

const markdown = fs.readFileSync(inputPath, "utf8");

const toPlain = (text) =>
  text
    .replace(/^#{1,6}\s?/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)")
    .replace(/^\>\s?/gm, "Note: ")
    .replace(/^\-\s/gm, "• ")
    .replace(/\r\n/g, "\n");

const plainText = toPlain(markdown);

const pdfDoc = await PDFDocument.create();
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

const pageWidth = 595.28; // A4 width
const pageHeight = 841.89; // A4 height
const margin = 44;
const maxWidth = pageWidth - margin * 2;
const fontSize = 10;
const lineHeight = 15;

let page = pdfDoc.addPage([pageWidth, pageHeight]);
let y = pageHeight - margin;

const drawLine = (line, isTitle = false) => {
  const useFont = isTitle ? titleFont : font;
  const useSize = isTitle ? 13 : fontSize;
  const useColor = isTitle ? rgb(0.8, 0.1, 0.1) : rgb(0.1, 0.1, 0.1);

  if (y < margin + lineHeight) {
    page = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
  }

  page.drawText(line, {
    x: margin,
    y,
    size: useSize,
    font: useFont,
    color: useColor,
  });

  y -= isTitle ? 19 : lineHeight;
};

const wrap = (line) => {
  if (!line.trim()) return [""];

  const words = line.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(test, fontSize);
    if (width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
};

drawLine("Grocyon Frontend - Operational Documentation", true);
drawLine(`Generated: ${new Date().toISOString().slice(0, 10)}`);
drawLine("");

for (const rawLine of plainText.split("\n")) {
  const line = rawLine.trimEnd();
  const looksLikeSection =
    /^\d+\)/.test(line) ||
    /^(\d+(\.\d+)+)\s/.test(line) ||
    /^Grocyon Frontend/.test(line);

  if (!line) {
    y -= 6;
    continue;
  }

  if (looksLikeSection) {
    drawLine(line, true);
    continue;
  }

  for (const wrapped of wrap(line)) {
    drawLine(wrapped);
  }
}

const pdfBytes = await pdfDoc.save();
fs.writeFileSync(outputPath, pdfBytes);

console.log(`PDF generated: ${outputPath}`);
