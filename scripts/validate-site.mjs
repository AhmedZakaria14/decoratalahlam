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
  if (!html.includes('href="https://nasharhub.com/"')) failures.push(`${file}: NasharHub developer credit is missing`);
  if (!html.includes('rel="noopener noreferrer"')) failures.push(`${file}: developer credit external-link protection is missing`);
  checkCount("visible breadcrumb", /<nav\s+class=["']visible-breadcrumb["']/gi);
  if (!html.includes('aria-label="مسار التنقل"')) failures.push(`${file}: visible breadcrumb has no accessible label`);

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
const homeHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const homeTitle = (homeHtml.match(/<title>([^<]+)<\/title>/i) || [null, ""])[1].trim();
if (homeTitle.length < 50 || homeTitle.length > 60) failures.push(`index.html: title length is ${homeTitle.length}, expected 50-60 characters`);
if (!fs.readFileSync(path.join(root, "robots.txt"), "utf8").includes("Sitemap: https://decoratalahlam.com/sitemap.xml")) failures.push("robots.txt has the wrong sitemap URL");
const cloudflareHeaders = fs.readFileSync(path.join(root, "_headers"), "utf8");
if (!cloudflareHeaders.includes("Strict-Transport-Security")) failures.push("Cloudflare HSTS header configuration is missing");
if (!cloudflareHeaders.includes("/sitemap.xml") || !cloudflareHeaders.includes("application/xml")) failures.push("Cloudflare sitemap headers are missing");
if (!cloudflareHeaders.includes("https://:project.pages.dev/*") || !cloudflareHeaders.includes("noindex")) failures.push("Cloudflare pages.dev noindex rule is missing");

const cloudflareRedirects = fs.readFileSync(path.join(root, "_redirects"), "utf8");
for (const route of ["gypsum-board", "marble-alternative", "wallpaper-installation", "parquet-installation", "wood-cladding", "chipboard-installation", "interior-decor"]) {
  if (!cloudflareRedirects.includes(`/${route} /${route}-ar 308`)) failures.push(`Cloudflare canonical redirect is missing for ${route}`);
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
if (new Set(sitemapUrls).size !== sitemapUrls.length) failures.push("sitemap.xml contains duplicate URLs");
for (const url of sitemapUrls) {
  if (!url.startsWith("https://decoratalahlam.com/")) failures.push(`sitemap.xml contains a non-production URL: ${url}`);
  const route = new URL(url).pathname.replace(/^\//, "") || "index";
  const file = route === "index" ? "index.html" : `${route}.html`;
  if (!fs.existsSync(path.join(root, file))) failures.push(`sitemap.xml route has no HTML file: ${url}`);
  else {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    if (!html.includes(`<link rel="canonical" href="${url}">`)) failures.push(`sitemap URL and canonical differ: ${url}`);
  }
}

const llms = fs.readFileSync(path.join(root, "llms.txt"), "utf8");
if (!llms.includes("https://decoratalahlam.com/sitemap.xml")) failures.push("llms.txt does not reference the production sitemap");
if (llms.includes("decoratalahlam.vercel.app")) failures.push("llms.txt contains the stale Vercel domain");

for (const file of ["difference-shipboard-alternative.html", "shipboard-alternative-riyadh.html", "shipboard-installation.html", "shipboard-riyadh.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const blogImages = [...html.matchAll(/<img\b[^>]*src=["']\.\/IMG\/blog\/([^"']+)["'][^>]*>/gi)];
  if (blogImages.length !== 6) failures.push(`${file}: expected 6 contextual blog images, found ${blogImages.length}`);
  for (const match of blogImages) {
    if (!/\balt=["'][^"']+["']/i.test(match[0])) failures.push(`${file}: blog image is missing descriptive alt text (${match[1]})`);
    if (!match[1].endsWith(".webp")) failures.push(`${file}: blog image is not WebP (${match[1]})`);
  }
  if (!/<meta property="og:image" content="https:\/\/decoratalahlam\.com\/IMG\/blog\/[^"]+\.webp">/.test(html)) failures.push(`${file}: optimized Open Graph image is missing`);
}

for (const image of fs.readdirSync(path.join(root, "IMG", "blog"))) {
  const bytes = fs.statSync(path.join(root, "IMG", "blog", image)).size;
  if (bytes > 200_000) failures.push(`IMG/blog/${image}: optimized image is larger than 200 KB`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages, structured data, local assets, minified resources and security configuration.`);
