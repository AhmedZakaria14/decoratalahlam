import fs from "node:fs";

const credit = `
        <!-- DEVELOPER CREDIT START -->
        <div class="developer-credit">
            <span>تم التطوير بواسطة</span>
            <a href="https://nasharhub.com/" target="_blank" rel="noopener noreferrer" aria-label="زيارة موقع NasharHub لتطوير المواقع">NasharHub</a>
        </div>
        <!-- DEVELOPER CREDIT END -->
`;

const files = fs.readdirSync(".").filter(file => file.endsWith(".html"));
for (const file of files) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/\s*<!-- DEVELOPER CREDIT START -->[\s\S]*?<!-- DEVELOPER CREDIT END -->\s*/g, "\n");
  html = html.replace(/\s*<\/footer>/i, `${credit}\n    </footer>`);
  fs.writeFileSync(file, html);
}

console.log(`Added the NasharHub developer credit to ${files.length} pages.`);
