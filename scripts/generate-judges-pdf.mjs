import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const projectRoot = process.cwd();
const markdownPath = path.join(projectRoot, "docs", "judges-qa.md");
const htmlPath = path.join(projectRoot, "docs", "judges-qa.html");
const pdfPath = path.join(projectRoot, "docs", "judges-qa.pdf");

const markdown = fs.readFileSync(markdownPath, "utf8");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function markdownToHtml(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push("<p class=\"spacer\"></p>");
      continue;
    }

    if (line.startsWith("# ")) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith("## ")) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      continue;
    }

    if (inList) {
      out.push("</ul>");
      inList = false;
    }

    out.push(`<p>${escapeHtml(line)}</p>`);
  }

  if (inList) {
    out.push("</ul>");
  }

  return out.join("\n");
}

const contentHtml = markdownToHtml(markdown);

const fullHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>GovSense Judge Q&A</title>
  <style>
    body { font-family: "Segoe UI", Arial, sans-serif; color: #111827; margin: 34px; line-height: 1.5; }
    h1 { font-size: 28px; margin: 0 0 16px; color: #0f2e5e; }
    h2 { font-size: 18px; margin: 20px 0 8px; color: #1f2937; page-break-after: avoid; }
    p { margin: 0 0 8px; font-size: 12px; }
    ul { margin: 6px 0 10px 20px; padding: 0; }
    li { margin: 0 0 4px; font-size: 12px; }
    .spacer { height: 4px; margin: 0; }
    @page { size: A4; margin: 18mm; }
  </style>
</head>
<body>
${contentHtml}
</body>
</html>`;

fs.writeFileSync(htmlPath, fullHtml, "utf8");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`file://${htmlPath.replaceAll("\\", "/")}`, { waitUntil: "load" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "16mm", right: "12mm", bottom: "16mm", left: "12mm" },
});
await browser.close();

console.log(`Generated: ${pdfPath}`);
