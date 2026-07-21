import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseUrl = "https://decoratalahlam.com";
const phone = "+966531169312";

const canonicalRoutes = new Map([
  ["about.html", "about-us"],
  ["contact.html", "contact-us"],
  ["services.html", "services-ar"],
  ["gypsum-board.html", "gypsum-board-ar"],
  ["marble-alternative.html", "marble-alternative-ar"],
  ["wallpaper-installation.html", "wallpaper-installation-ar"],
  ["parquet-installation.html", "parquet-installation-ar"],
  ["wood-cladding.html", "wood-cladding-ar"],
  ["chipboard-installation.html", "chipboard-installation-ar"],
  ["interior-decor.html", "interior-decor-ar"]
]);

const faq = [
  ["ما هي الخدمات التي تقدمها ديكورات الأحلام؟", "نقدم خدمات متكاملة تشمل تركيب جبس بورد، بديل الرخام، ورق جدران، باركيه، تكسيات خشبية، وشيبورد، بالإضافة إلى تصميم وتنفيذ الديكورات الداخلية المتكاملة."],
  ["هل توفرون خدماتكم خارج مدينة الرياض؟", "نتواجد بشكل رئيسي في مدينة الرياض بالمملكة العربية السعودية، ونخدم المشاريع السكنية والتجارية في المنطقة."],
  ["كيف يمكنني التواصل لطلب عرض سعر؟", "يمكنكم التواصل معنا مباشرة عبر الاتصال الهاتفي أو الواتساب على الرقم 0531169312 للحصول على استشارة مجانية وعرض سعر لمشروعكم."]
];

const serviceNames = new Map([
  ["gypsum-board", "تركيب جبس بورد"],
  ["marble-alternative", "تركيب بديل الرخام"],
  ["wallpaper-installation", "تركيب ورق جدران"],
  ["parquet-installation", "تركيب باركيه"],
  ["wood-cladding", "تركيب تكسيات خشبية"],
  ["chipboard-installation", "تركيب شيبورد"],
  ["interior-decor", "تصميم وتنفيذ الديكورات الداخلية"],
  ["shipboard-installation", "تركيب شيبورد بالرياض"],
  ["shipboard-riyadh", "تركيب شيبورد الرياض"],
  ["shipboard-alternative-riyadh", "تركيب بديل الشيبورد بالرياض"]
]);

function cleanText(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
}

function canonicalFor(file) {
  if (file === "index.html") return `${baseUrl}/`;
  return `${baseUrl}/${canonicalRoutes.get(file) || file.replace(/\.html$/, "")}`;
}

function serviceNameFor(file) {
  const stem = file.replace(/-ar\.html$/, "").replace(/\.html$/, "");
  return serviceNames.get(stem) || null;
}

function graphFor(file, title, currentName) {
  const canonical = canonicalFor(file);
  const business = {
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#business`,
    name: "ديكورات الأحلام",
    image: `${baseUrl}/IMG/logo.png`,
    url: `${baseUrl}/`,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "الرياض",
      addressLocality: "الرياض",
      addressRegion: "منطقة الرياض",
      addressCountry: "SA"
    },
    areaServed: { "@type": "City", name: "الرياض" },
    sameAs: ["https://wa.me/966531169312"]
  };

  const breadcrumbs = [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: `${baseUrl}/` }];
  const serviceName = serviceNameFor(file);
  if (file !== "index.html") {
    if (serviceName) {
      breadcrumbs.push({ "@type": "ListItem", position: 2, name: "خدماتنا", item: `${baseUrl}/services-ar` });
    } else if (/^(best-paints|difference-|paints-|shipboard-)/.test(file)) {
      breadcrumbs.push({ "@type": "ListItem", position: 2, name: "المدونة", item: `${baseUrl}/blog` });
    }
    breadcrumbs.push({ "@type": "ListItem", position: breadcrumbs.length + 1, name: currentName, item: canonical });
  }

  const graph = [
    business,
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: title,
      inLanguage: "ar-SA",
      isPartOf: { "@id": `${baseUrl}/#website` },
      about: { "@id": `${baseUrl}/#business` }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: breadcrumbs
    }
  ];

  if (file === "index.html") {
    graph.push({
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: `${baseUrl}/`,
      name: "ديكورات الأحلام",
      inLanguage: "ar-SA",
      publisher: { "@id": `${baseUrl}/#business` }
    });
    graph.push({
      "@type": "Service",
      "@id": `${baseUrl}/#decoration-service`,
      serviceType: "Interior Decoration and Finishing",
      provider: { "@id": `${baseUrl}/#business` },
      areaServed: { "@type": "City", name: "الرياض" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "خدمات الديكور والتشطيب",
        itemListElement: ["تركيب جبس بورد", "تركيب بديل الرخام", "تركيب ورق جدران", "تركيب باركيه", "تركيب تكسيات خشبية", "تركيب شيبورد"].map(name => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name }
        }))
      }
    });
    graph.push({
      "@type": "FAQPage",
      "@id": `${baseUrl}/#faq`,
      mainEntity: faq.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text }
      }))
    });
  } else if (serviceName) {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: serviceName,
      serviceType: serviceName,
      provider: { "@id": `${baseUrl}/#business` },
      areaServed: { "@type": "City", name: "الرياض" },
      availableLanguage: "ar"
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function faqMarkup() {
  return `\n<!-- FAQ CONTENT START -->\n<section class="seo-faq" id="faq" aria-labelledby="faq-title">\n  <div class="seo-faq__inner">\n    <h2 id="faq-title">الأسئلة الشائعة</h2>\n    ${faq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("\n    ")}\n  </div>\n</section>\n<!-- FAQ CONTENT END -->\n`;
}

for (const file of fs.readdirSync(root).filter(name => name.endsWith(".html"))) {
  const fullPath = path.join(root, file);
  let html = fs.readFileSync(fullPath, "utf8");
  html = html.replace(/\s*<!-- SEO AUDIT ENHANCEMENTS START -->[\s\S]*?<!-- SEO AUDIT ENHANCEMENTS END -->\s*/gi, "\n")
    .replace(/\s*<!-- FAQ CONTENT START -->[\s\S]*?<!-- FAQ CONTENT END -->\s*/gi, "\n")
    .replace(/\s*<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\s*/gi, "\n")
    .replace(/\s*<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>\s*/gi, "\n")
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>\s*/gi, "\n")
    .replace(/\s*<meta\s+property=["']og:(?:url|image)["'][^>]*>\s*/gi, "\n")
    .replaceAll("https://decoratalahlam.vercel.app", baseUrl);

  const contentHtml = html.replace(/<!--[\s\S]*?-->/g, "");
  const title = cleanText((contentHtml.match(/<title>([\s\S]*?)<\/title>/i) || [null, "ديكورات الأحلام"])[1]);
  const h1 = cleanText((contentHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [null, title])[1]) || title;
  const canonical = canonicalFor(file);
  const schema = JSON.stringify(graphFor(file, title, h1), null, 2);
  const headBlock = `\n<!-- SEO AUDIT ENHANCEMENTS START -->\n<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','GTM-TDMVDGZL');</script>\n<!-- End Google Tag Manager -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-DQNXN01128"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-DQNXN01128');</script>\n<meta name="google-site-verification" content="hhP-tCyyQHvpel6nJ-1nRwhdmsply67V7k7QaIguOjI">\n<link rel="canonical" href="${canonical}">\n<meta property="og:url" content="${canonical}">\n<meta property="og:image" content="${baseUrl}/IMG/logo.png">\n<link rel="stylesheet" href="./css/seo-enhancements.min.css">\n<script type="application/ld+json">\n${schema}\n</script>\n<!-- SEO AUDIT ENHANCEMENTS END -->\n`;

  if (/<meta\s+charset=["'][^"']+["'][^>]*>/i.test(html)) {
    html = html.replace(/(<meta\s+charset=["'][^"']+["'][^>]*>)/i, `$1${headBlock}`);
  } else {
    html = html.replace(/<head>/i, `<head>${headBlock}`);
  }
  html = html.replace(/<body([^>]*)>/i, `<body$1>\n<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TDMVDGZL" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>\n<!-- End Google Tag Manager (noscript) -->`);
  if (file === "index.html") html = html.replace(/<footer\b/i, `${faqMarkup()}<footer`);
  fs.writeFileSync(fullPath, html);
}

console.log("Applied SEO, schema, analytics and responsive improvements to all HTML pages.");
