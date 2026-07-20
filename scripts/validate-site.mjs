import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const htmlFiles = fs.readdirSync(root).filter(file => file.endsWith(".html"));
const failures = [];
const count = (text, regex) => [...text.matchAll(regex)].length;

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const checkCount = (label, regex, expected = 1) => {
    const actual = count(html, regex);
    if (actual !== expected) failures.push(`${file}: ${label} count is ${actual}, expected ${expected}`);
  };

  checkCount("canonical", /<link\s+rel=["']canonical["']/gi);
  checkCount("JSON-LD", /<script\s+type=["']application\/ld\+json["']>/gi);
  checkCount("GTM noscript", /googletagmanager\.com\/ns\.html\?id=GTM-TDMVDGZL/gi);
  if (!html.includes("G-DQNXN01128")) failures.push(`${file}: Google Analytics tag is missing`);
  if (!html.includes("hhP-tCyyQHvpel6nJ-1nRwhdmsply67V7k7QaIguOjI")) failures.push(`${file}: Search Console verification is missing`);
  if (html.indexOf("<meta charset=") > 1024) failures.push(`${file}: charset declaration is too late in the document`);
  if (html.includes("decoratalahlam.vercel.app")) failures.push(`${file}: stale Vercel domain found`);

  for (const match of html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]);
      const graph = data["@graph"] || [];
      if (!graph.some(item => item["@type"] === "BreadcrumbList")) failures.push(`${file}: BreadcrumbList schema is missing`);
      if (file === "index.html" && !graph.some(item => item["@type"] === "FAQPage")) failures.push(`${file}: FAQPage schema is missing`);
    } catch (error) {
      failures.push(`${file}: invalid JSON-LD (${error.message})`);
    }
  }

  for (const match of html.matchAll(/(?:href|src)=["'](\.\/[^"'#?]+)["']/gi)) {
    const ref = match[1].replace(/^\.\//, "");
    if (!fs.existsSync(path.join(root, ref))) failures.push(`${file}: missing local asset ${ref}`);
    if (/^(?:css|js)\//.test(ref) && !/\.min\.(?:css|js)$/.test(ref)) failures.push(`${file}: unminified asset is still referenced: ${ref}`);
  }
}

for (const type of ["css", "js"]) {
  const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
  for (const minified of walk(path.join(root, type)).filter(file => file.endsWith(`.min.${type}`))) {
    const source = minified.replace(`.min.${type}`, `.${type}`);
    if (!fs.existsSync(source)) failures.push(`Missing source file for ${path.relative(root, minified)}`);
    else if (fs.statSync(minified).size >= fs.statSync(source).size) failures.push(`${path.relative(root, minified)} is not smaller than its source`);
  }
}

if (!fs.readFileSync(path.join(root, "index.html"), "utf8").includes("<!-- FAQ CONTENT START -->")) failures.push("Visible FAQ content is missing from index.html");
if (!fs.readFileSync(path.join(root, "robots.txt"), "utf8").includes("Sitemap: https://decoratalahlam.com/sitemap.xml")) failures.push("robots.txt has the wrong sitemap URL");
if (!fs.readFileSync(path.join(root, "vercel.json"), "utf8").includes("Strict-Transport-Security")) failures.push("HSTS header configuration is missing");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages, structured data, local assets, minified resources and security configuration.`);
