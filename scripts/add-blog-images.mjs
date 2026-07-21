import fs from "node:fs";

const base = "https://decoratalahlam.com/IMG/blog/";
const pages = {
  "difference-shipboard-alternative.html": [
    ["shipboard-alternative-teak-panel.webp", "لوح بديل الشيبورد بلون خشب التيك لتكسية الجدران", "بديل شيبورد بدرجة خشب التيك."],
    ["shipboard-alternative-natural-oak-panel.webp", "لوح بديل الشيبورد بلون البلوط الطبيعي", "درجة بلوط طبيعي للمساحات الدافئة."],
    ["shipboard-alternative-black-panel.webp", "لوح بديل الشيبورد الأسود بتعرجات خشبية", "اللون الأسود للديكورات العصرية."],
    ["shipboard-alternative-light-grey-panel.webp", "لوح بديل الشيبورد الرمادي الفاتح", "درجة رمادي فاتح مناسبة للمساحات الحديثة."],
    ["shipboard-alternative-red-panel.webp", "لوح بديل الشيبورد بدرجة الخشب الأحمر", "درجة خشب أحمر ضمن خيارات بديل الشيبورد."],
    ["shipboard-alternative-wenge-panel.webp", "لوح بديل الشيبورد بلون وينج بني", "لون وينج بني بملمس خشبي واضح."]
  ],
  "shipboard-alternative-riyadh.html": [
    ["shipboard-colors-display.webp", "عرض ألوان بديل الشيبورد الخشبية في الرياض", "مجموعة درجات خشبية لاختيار اللون المناسب."],
    ["shipboard-wood-color-samples.webp", "عينات ألوان شرائح الشيبورد وبديل الخشب", "عينات فعلية لدرجات الشيبورد الداكنة والفاتحة."],
    ["shipboard-commercial-interior.webp", "تنفيذ بديل الشيبورد في مساحة تجارية بالرياض", "استخدام الشيبورد مع الإضاءة في مشروع تجاري."],
    ["shipboard-lit-column.webp", "عمود ديكوري من الشيبورد بإضاءة داخلية", "تصميم عمود شيبورد مضاء داخل مشروع تجاري."],
    ["shipboard-sample-catalog.webp", "كتالوج عينات ألوان بديل الشيبورد", "كتالوج ألوان يساعد على تنسيق الخامة مع الديكور."],
    ["shipboard-slats-color-range.webp", "شرائح بديل الشيبورد بألوان خشبية متعددة", "درجات متنوعة من شرائح بديل الشيبورد."]
  ],
  "shipboard-installation.html": [
    ["shipboard-installation-site-01.webp", "مراحل تركيب الشيبورد في مشروع ديكور داخلي بالرياض", "موقع العمل أثناء تركيب فواصل وعناصر الشيبورد."],
    ["shipboard-installation-site-02.webp", "فنيون ينفذون ديكور شيبورد بإضاءة مخفية", "مرحلة تنفيذ الشيبورد داخل مشروع تجاري."],
    ["shipboard-wall-installation.webp", "تركيب ألواح الشيبورد على جدار داخلي", "تجهيز وتركيب شرائح الشيبورد على الجدار."],
    ["shipboard-reception-installation.webp", "تنفيذ كاونتر استقبال بكسوة شيبورد", "تركيب كسوة الشيبورد في منطقة الاستقبال."],
    ["shipboard-decor-lighting-work.webp", "دمج الشيبورد مع وحدات الإضاءة الديكورية", "تنفيذ خطوط إضاءة داخل تصميم الشيبورد."],
    ["shipboard-divider-installation.webp", "تركيب فاصل شيبورد ديكوري داخل مساحة تجارية", "فاصل ديكوري يجمع بين الشيبورد والإضاءة."]
  ],
  "shipboard-riyadh.html": [
    ["shipboard-office-reception.webp", "ديكور استقبال مكتب بالشيبورد والرخام في الرياض", "نموذج استقبال مكتب بعد تنفيذ تكسيات الشيبورد."],
    ["shipboard-modern-interior.webp", "ديكور شيبورد مودرن للجدران والأسقف", "تناسق الشيبورد الداكن مع السقف والإضاءة."],
    ["shipboard-counter-design.webp", "كاونتر شيبورد بإضاءة مخفية وتصميم عصري", "كاونتر مكسو بالشيبورد مع إضاءة دافئة."],
    ["shipboard-wall-with-lighting.webp", "جدار شيبورد مع خلفية ديكورية وإضاءة", "تشطيب جدار تجاري بالشيبورد والإضاءة المخفية."],
    ["shipboard-decor-column.webp", "عمود شيبورد مضاء في ديكور داخلي فاخر", "عمود شيبورد هندسي يضيف عمقًا للمساحة."],
    ["shipboard-interior-finishing.webp", "تشطيب داخلي كامل باستخدام الشيبورد", "نموذج نهائي يجمع الشيبورد مع الخامات الحديثة."]
  ]
};

for (const [file, images] of Object.entries(pages)) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/\s*<!-- BLOG IMAGE GALLERY START -->[\s\S]*?<!-- BLOG IMAGE GALLERY END -->\s*/g, "\n");
  if (!html.includes("./css/blog-gallery.min.css")) {
    html = html.replace('<link rel="stylesheet" href="./css/floating-buttons.min.css">', '<link rel="stylesheet" href="./css/floating-buttons.min.css">\n    <link rel="stylesheet" href="./css/blog-gallery.min.css">');
  }
  const [hero, ...gallery] = images;
  html = html.replace(/<meta property="og:image" content="[^"]+">/, `<meta property="og:image" content="${base}${hero[0]}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="${base}${hero[0]}">`);
  html = html.replace(/<img\s+src="\.\/IMG\/[^"]+"\s+alt="[^"]*"\s+class="post-header-img">/, `<img src="./IMG/blog/${hero[0]}" alt="${hero[1]}" class="post-header-img" width="1200" height="800" loading="eager" fetchpriority="high" decoding="async">`);
  const figures = gallery.map(([src, alt, caption]) => `                <figure><img src="./IMG/blog/${src}" alt="${alt}" loading="lazy" decoding="async" width="1200" height="900"><figcaption>${caption}</figcaption></figure>`).join("\n");
  const block = `\n            <!-- BLOG IMAGE GALLERY START -->\n            <h2 class="blog-gallery-title">صور من خامات وتنفيذ الشيبورد</h2>\n            <div class="blog-image-gallery" aria-label="صور توضيحية لأعمال وخامات الشيبورد">\n${figures}\n            </div>\n            <!-- BLOG IMAGE GALLERY END -->\n`;
  html = html.replace(/\s*<div class="cta-box">/, `${block}\n            <div class="cta-box">`);
  fs.writeFileSync(file, html);
}

console.log(`Added ${Object.values(pages).flat().length} optimized images to ${Object.keys(pages).length} blog articles.`);
