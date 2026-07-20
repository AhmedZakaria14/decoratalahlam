import fs from "node:fs";
import path from "node:path";

for (const file of fs.readdirSync(process.cwd()).filter(name => name.endsWith(".html"))) {
  const fullPath = path.join(process.cwd(), file);
  let html = fs.readFileSync(fullPath, "utf8");
  html = html
    .replace(/(["'])(\.\/css\/[^"']+?)(?<!\.min)\.css\1/gi, "$1$2.min.css$1")
    .replace(/(["'])(\.\/js\/[^"']+?)(?<!\.min)\.js\1/gi, "$1$2.min.js$1")
    .replace(/<script(?![^>]*\b(?:async|defer)\b)([^>]*\bsrc=["']\.\/js\/[^"']+["'][^>]*)>/gi, "<script defer$1>");
  fs.writeFileSync(fullPath, html);
}

console.log("Updated every HTML page to load minified local CSS and JavaScript assets.");
