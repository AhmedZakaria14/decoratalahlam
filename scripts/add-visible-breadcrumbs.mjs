import fs from "node:fs";

const escapeHtml = value => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const files = fs.readdirSync(".").filter(file => file.endsWith(".html"));
for (const file of files) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/\s*<!-- VISIBLE BREADCRUMB START -->[\s\S]*?<!-- VISIBLE BREADCRUMB END -->\s*/g, "\n");
  const schemaMatch = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (!schemaMatch) throw new Error(`${file}: JSON-LD schema not found`);
  const schema = JSON.parse(schemaMatch[1]);
  const breadcrumb = schema["@graph"]?.find(item => item["@type"] === "BreadcrumbList");
  if (!breadcrumb?.itemListElement?.length) throw new Error(`${file}: BreadcrumbList items not found`);

  const items = breadcrumb.itemListElement.map((item, index, all) => {
    const name = escapeHtml(item.name);
    const isLast = index === all.length - 1;
    return isLast
      ? `                <li><span aria-current="page">${name}</span></li>`
      : `                <li><a href="${escapeHtml(item.item)}">${name}</a></li>`;
  }).join("\n");

  const nav = `
    <!-- VISIBLE BREADCRUMB START -->
    <nav class="visible-breadcrumb" aria-label="مسار التنقل">
        <ol>
${items}
        </ol>
    </nav>
    <!-- VISIBLE BREADCRUMB END -->
`;
  html = html.replace(/\s*<main\b/i, `${nav}\n    <main`);
  fs.writeFileSync(file, html);
}

console.log(`Added schema-matched visible breadcrumbs to ${files.length} pages.`);
