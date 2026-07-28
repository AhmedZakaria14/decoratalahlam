import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html")).sort();

const articleFiles = new Set([
  "best-paints-decor-riyadh.html",
  "difference-shipboard-alternative.html",
  "paints-east-riyadh.html",
  "paints-north-riyadh.html",
  "shipboard-alternative-riyadh.html",
  "shipboard-installation.html",
  "shipboard-riyadh.html",
]);

const serviceFiles = new Set([
  "chipboard-installation-ar.html",
  "chipboard-installation.html",
  "gypsum-board-ar.html",
  "gypsum-board.html",
  "interior-decor-ar.html",
  "interior-decor.html",
  "marble-alternative-ar.html",
  "marble-alternative.html",
  "parquet-installation-ar.html",
  "parquet-installation.html",
  "wallpaper-installation-ar.html",
  "wallpaper-installation.html",
  "wood-cladding-ar.html",
  "wood-cladding.html",
]);

function capture(source, pattern) {
  return source.match(pattern)?.[0] ?? "";
}

function captureAll(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[0]);
}

function seoSnapshot(source) {
  return JSON.stringify({
    title: capture(source, /<title>[\s\S]*?<\/title>/i),
    description: capture(source, /<meta\s+name=["']description["'][^>]*>/i),
    canonical: capture(source, /<link\s+rel=["']canonical["'][^>]*>/i),
    robots: capture(source, /<meta\s+name=["']robots["'][^>]*>/i),
    jsonLd: captureAll(
      source,
      /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    ),
    h1: captureAll(source, /<h1\b[^>]*>[\s\S]*?<\/h1>/gi).map(cleanText),
  });
}

function addBodyClass(source, pageClass) {
  return source.replace(/<body([^>]*)>/i, (full, attrs) => {
    if (/\bclass=["'][^"']*\bmodern-site\b/i.test(full)) {
      return full.replace(
        /\bclass=(["'])(.*?)\1/i,
        (_match, quote, classes) =>
          `class=${quote}${classes
            .replace(/\bpage-(?:home|blog-index|article|service|standard)\b/g, "")
            .trim()} ${pageClass}${quote}`,
      );
    }

    return `<body${attrs} class="modern-site ${pageClass}">`;
  });
}

function addShellEnhancements(source) {
  let next = source
    .replace(/\s*<!-- MODERN THEME START -->[\s\S]*?<!-- MODERN THEME END -->\s*/g, "\n")
    .replace(/\s*<!-- MODERN UI START -->[\s\S]*?<!-- MODERN UI END -->\s*/g, "\n")
    .replace(/\s*<!-- SKIP LINK START -->[\s\S]*?<!-- SKIP LINK END -->\s*/g, "\n");

  next = next.replace(
    /<\/head>/i,
    `    <!-- MODERN THEME START -->
    <link rel="stylesheet" href="./css/modern-theme.min.css?v=20260728-3">
    <!-- MODERN THEME END -->
</head>`,
  );

  next = next.replace(
    /<body([^>]*)>/i,
    `<body$1>
    <!-- SKIP LINK START -->
    <a class="skip-link" href="#main-content">تخطَّ إلى المحتوى</a>
    <!-- SKIP LINK END -->`,
  );

  next = next.replace(/<main(?![^>]*\bid=)([^>]*)>/i, `<main id="main-content"$1>`);
  next = next.replace(
    /<\/body>/i,
    `    <!-- MODERN UI START -->
    <script src="./js/modern-ui.min.js?v=20260728-3" defer></script>
    <!-- MODERN UI END -->
</body>`,
  );

  return next;
}

function cleanText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function enhanceArticle(source) {
  let next = source.replace(
    /\s*<!-- ARTICLE TOC START -->[\s\S]*?<!-- ARTICLE TOC END -->\s*/g,
    "\n",
  );
  next = next.replace(
    /(<h2\b[^>]*?)\s+id=["']article-section-\d+["']([^>]*>)/gi,
    "$1$2",
  );

  const postBodyPattern = /(<div class="post-body">)([\s\S]*?)(<\/div>)/i;
  const match = next.match(postBodyPattern);
  if (!match) {
    throw new Error("Article page is missing .post-body");
  }

  let counter = 0;
  const tocEntries = [];
  const enhancedBody = match[2].replace(
    /<h2(?![^>]*\bid=)([^>]*)>([\s\S]*?)<\/h2>/gi,
    (full, attrs, inner) => {
      counter += 1;
      const id = `article-section-${counter}`;
      const label = cleanText(inner);
      if (label && label.toLowerCase() !== "meta description:") {
        tocEntries.push({ id, label });
      }
      return `<h2${attrs} id="${id}">${inner}</h2>`;
    },
  );

  next = next.replace(
    postBodyPattern,
    `${match[1]}${enhancedBody}${match[3]}`,
  );

  const items = tocEntries
    .map(
      ({ id, label }) =>
        `                    <li><a href="#${id}">${escapeHtml(label)}</a></li>`,
    )
    .join("\n");

  const toc = `
            <!-- ARTICLE TOC START -->
            <details class="article-toc">
                <summary>
                    <span>محتويات المقال</span>
                    <small>${tocEntries.length} محاور عملية</small>
                </summary>
                <ol>
${items}
                </ol>
            </details>
            <!-- ARTICLE TOC END -->
`;

  next = next.replace(/(<h1\b[^>]*>[\s\S]*?<\/h1>)/i, `$1${toc}`);
  return next;
}

function enhanceBlogIndex(source) {
  let next = source.replace(/<main\b[\s\S]*?<\/main>/i, (main) =>
    main.replace(/\sstyle="[^"]*"/gi, ""),
  );

  const imageMap = new Map([
    ["./IMG/شيبورد3.jpeg", "./IMG/blog/shipboard-alternative-teak-panel.webp"],
    ["./IMG/شيبورد4.jpeg", "./IMG/blog/shipboard-colors-display.webp"],
    ["./IMG/شيبورد1.jpeg", "./IMG/blog/shipboard-installation-site-01.webp"],
    ["./IMG/شيبورد2.jpeg", "./IMG/blog/shipboard-office-reception.webp"],
  ]);

  for (const [oldSource, newSource] of imageMap) {
    next = next.replaceAll(`src="${oldSource}"`, `src="${newSource}"`);
  }

  next = next.replace(
    /<img\b(?![^>]*\bloading=)([^>]+)>/gi,
    `<img$1 loading="lazy" decoding="async">`,
  );
  return next;
}

const originalInfrastructure = {
  robots: fs.readFileSync(path.join(root, "robots.txt"), "utf8"),
  sitemap: fs.readFileSync(path.join(root, "sitemap.xml"), "utf8"),
  llms: fs.readFileSync(path.join(root, "llms.txt"), "utf8"),
};

for (const file of htmlFiles) {
  const filePath = path.join(root, file);
  const original = fs.readFileSync(filePath, "utf8");
  const beforeSeo = seoSnapshot(original);

  const pageClass =
    file === "index.html"
      ? "page-home"
      : file === "blog.html"
        ? "page-blog-index"
        : articleFiles.has(file)
          ? "page-article"
          : serviceFiles.has(file)
            ? "page-service"
            : "page-standard";

  let next = addBodyClass(original, pageClass);
  next = addShellEnhancements(next);

  if (articleFiles.has(file)) {
    next = enhanceArticle(next);
  }
  if (file === "blog.html") {
    next = enhanceBlogIndex(next);
  }

  if (seoSnapshot(next) !== beforeSeo) {
    throw new Error(`SEO invariant failed for ${file}`);
  }

  fs.writeFileSync(filePath, next);
}

for (const [file, expected] of Object.entries(originalInfrastructure)) {
  const actual = fs.readFileSync(path.join(root, file === "llms" ? "llms.txt" : `${file}.${file === "robots" ? "txt" : "xml"}`), "utf8");
  if (actual !== expected) {
    throw new Error(`${file} changed unexpectedly`);
  }
}

console.log(`Applied the modern redesign shell to ${htmlFiles.length} HTML pages.`);
