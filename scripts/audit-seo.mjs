import fs from "node:fs";
import path from "node:path";

const htmlFiles = fs
  .readdirSync(".")
  .filter((file) => file.endsWith(".html"))
  .sort();

const sitemap = fs.readFileSync("sitemap.xml", "utf8");
const canonicalPaths = new Set(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => {
    const url = new URL(match[1].trim());
    return decodeURI(url.pathname).replace(/\/+$/, "") || "/";
  }),
);

const stripTags = (value) =>
  value.replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? "";
};

const pagePath = (file) => (file === "index.html" ? "/" : `/${file.replace(/\.html$/, "")}`);
const knownPaths = new Map(
  htmlFiles
    .filter((file) => canonicalPaths.has(pagePath(file)))
    .map((file) => [pagePath(file), file]),
);
const normalizeInternalPath = (href) => {
  if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(href)) {
    return null;
  }

  let pathname;
  try {
    const url = new URL(href, "https://decoratalahlam.com/");
    if (url.hostname !== "decoratalahlam.com" && url.hostname !== "www.decoratalahlam.com") {
      return null;
    }
    pathname = decodeURI(url.pathname);
  } catch {
    return null;
  }

  pathname = pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  return pathname;
};

const pages = htmlFiles.map((file) => {
  const html = fs.readFileSync(file, "utf8");
  const descriptions = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => ({ name: attr(tag, "name"), content: attr(tag, "content") }))
    .filter((item) => item.name.toLowerCase() === "description")
    .map((item) => item.content.trim());
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) =>
    stripTags(match[1]),
  );
  const links = [...html.matchAll(/<a\b[^>]*>/gi)]
    .map(([tag]) => normalizeInternalPath(attr(tag, "href")))
    .filter(Boolean);

  return {
    file,
    urlPath: pagePath(file),
    descriptions,
    h1s,
    outbound: [...new Set(links)].filter((link) => knownPaths.has(link)),
  };
});

const canonicalPages = pages.filter((page) => canonicalPaths.has(page.urlPath));
const incoming = new Map(canonicalPages.map((page) => [page.urlPath, new Set()]));
for (const page of canonicalPages) {
  for (const link of page.outbound) {
    if (link !== page.urlPath) {
      incoming.get(link)?.add(page.urlPath);
    }
  }
}

const duplicateDescriptions = new Map();
for (const page of canonicalPages) {
  for (const description of page.descriptions) {
    if (!duplicateDescriptions.has(description)) duplicateDescriptions.set(description, []);
    duplicateDescriptions.get(description).push(page.file);
  }
}

console.log(
  JSON.stringify(
    {
      pages: canonicalPages.map((page) => ({
        file: page.file,
        metaDescriptions: page.descriptions,
        h1s: page.h1s,
        outgoingInternalLinks: page.outbound.length,
        incomingInternalLinks: incoming.get(page.urlPath)?.size ?? 0,
        incomingFrom: [...(incoming.get(page.urlPath) ?? [])],
      })),
      duplicateMetaDescriptions: [...duplicateDescriptions.entries()]
        .filter(([, files]) => files.length > 1)
        .map(([description, files]) => ({ description, files })),
      pagesWithInvalidH1Count: canonicalPages
        .filter((page) => page.h1s.length !== 1)
        .map((page) => ({ file: page.file, h1s: page.h1s })),
      pagesWithFewerThanTwoIncomingInternalLinks: canonicalPages
        .filter((page) => (incoming.get(page.urlPath)?.size ?? 0) < 2)
        .map((page) => ({
          file: page.file,
          count: incoming.get(page.urlPath)?.size ?? 0,
          incomingFrom: [...(incoming.get(page.urlPath) ?? [])],
        })),
    },
    null,
    2,
  ),
);
