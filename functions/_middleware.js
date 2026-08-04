const DISPLAY_PHONE = "+966 53 116 9312";
const SCHEMA_PHONE = "+966531169312";
const UPDATED_DATE = "2026-08-04";

const PHONE_SEPARATORS = "[\\s\\u00A0\\u200E\\u200F\\u202A-\\u202E\\u2066-\\u2069()\\-]*";
const PHONE_RE = new RegExp(
  `(^|[^\\d])(?:\\+?966${PHONE_SEPARATORS}53${PHONE_SEPARATORS}116${PHONE_SEPARATORS}9312|0?53${PHONE_SEPARATORS}116${PHONE_SEPARATORS}9312)(?!\\d)`,
  "g",
);

function normalizePhone(value) {
  return String(value ?? "")
    .replace(PHONE_RE, (_, prefix) => `${prefix}${DISPLAY_PHONE}`)
    .replace(/\s*\|\s*\|\s*/g, " | ")
    .trim();
}

function addPhoneToTitle(value) {
  const normalized = normalizePhone(value);
  if (!normalized) return DISPLAY_PHONE;
  if (normalized.includes(DISPLAY_PHONE)) return normalized;
  return `${normalized} | ${DISPLAY_PHONE}`;
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function schemaTypes(node) {
  const type = node?.["@type"];
  if (Array.isArray(type)) return type;
  return type ? [type] : [];
}

function ensureContactPoint(node) {
  const contactPoint = {
    "@type": "ContactPoint",
    telephone: SCHEMA_PHONE,
    contactType: "customer service",
    areaServed: "SA",
    availableLanguage: ["ar", "Arabic"],
  };

  if (!node.contactPoint) {
    node.contactPoint = contactPoint;
    return;
  }

  const points = Array.isArray(node.contactPoint) ? node.contactPoint : [node.contactPoint];
  for (const point of points) {
    if (point && typeof point === "object") point.telephone = SCHEMA_PHONE;
  }
}

function rewriteSchema(node, state) {
  if (Array.isArray(node)) {
    for (const item of node) rewriteSchema(item, state);
    return node;
  }

  if (!node || typeof node !== "object") return node;

  const types = schemaTypes(node);
  const isBusiness = types.some((type) => ["LocalBusiness", "Organization", "ProfessionalService", "HomeAndConstructionBusiness"].includes(type));
  const isPage = types.some((type) => ["WebPage", "WebSite", "CollectionPage", "AboutPage", "ContactPage", "ItemPage"].includes(type));
  const isArticle = types.some((type) => ["Article", "BlogPosting", "NewsArticle"].includes(type));

  if (isBusiness) {
    node.telephone = SCHEMA_PHONE;
    ensureContactPoint(node);
  }

  if (isPage && typeof node.name === "string") {
    node.name = addPhoneToTitle(node.name);
  }

  if (isArticle) {
    state.isArticle = true;
    if (typeof node.headline === "string") node.headline = addPhoneToTitle(node.headline);
    if (typeof node.name === "string") node.name = addPhoneToTitle(node.name);
    node.dateModified = UPDATED_DATE;
  }

  for (const value of Object.values(node)) rewriteSchema(value, state);
  return node;
}

class AttributeTitleHandler {
  constructor(state, marker) {
    this.state = state;
    this.marker = marker;
  }

  element(element) {
    const content = element.getAttribute("content");
    if (!content) return;

    const updated = addPhoneToTitle(content);
    element.setAttribute("content", updated);
    this.state[this.marker] = true;
    if (!this.state.pageTitle) this.state.pageTitle = updated;
  }
}

class OgTypeHandler {
  constructor(state) {
    this.state = state;
  }

  element(element) {
    this.state.isArticle = element.getAttribute("content")?.toLowerCase() === "article";
  }
}

class BufferedTitleHandler {
  constructor(state, { articleOnly = false, recordPageTitle = true } = {}) {
    this.state = state;
    this.articleOnly = articleOnly;
    this.recordPageTitle = recordPageTitle;
    this.buffer = "";
    this.active = true;
  }

  element() {
    this.buffer = "";
    this.active = !this.articleOnly || this.state.isArticle;
  }

  text(text) {
    if (!this.active) return;

    this.buffer += text.text;
    text.remove();

    if (text.lastInTextNode) {
      const updated = addPhoneToTitle(this.buffer);
      text.after(updated);
      if (this.recordPageTitle) this.state.pageTitle = updated;
      this.buffer = "";
      this.active = false;
    }
  }
}

class JsonLdHandler {
  constructor(state) {
    this.state = state;
    this.buffer = "";
  }

  element() {
    this.buffer = "";
  }

  text(text) {
    this.buffer += text.text;
    text.remove();

    if (!text.lastInTextNode) return;

    try {
      const data = JSON.parse(this.buffer);
      rewriteSchema(data, this.state);
      text.after(JSON.stringify(data));
    } catch {
      text.after(this.buffer);
    }

    this.buffer = "";
  }
}

class HeadHandler {
  constructor(state) {
    this.state = state;
  }

  element(element) {
    element.onEndTag((endTag) => {
      const title = this.state.pageTitle || `ديكورات الأحلام | ${DISPLAY_PHONE}`;
      const tags = [];

      if (!this.state.seenMetaTitle) {
        tags.push(`<meta name="title" content="${escapeAttribute(title)}">`);
      }
      if (!this.state.seenOgTitle) {
        tags.push(`<meta property="og:title" content="${escapeAttribute(title)}">`);
      }
      if (!this.state.seenTwitterTitle) {
        tags.push(`<meta name="twitter:title" content="${escapeAttribute(title)}">`);
      }

      tags.push(`<meta name="telephone" content="${DISPLAY_PHONE}">`);
      tags.push(`<meta name="contact" content="${DISPLAY_PHONE}">`);
      tags.push(`<meta property="business:contact_data:phone_number" content="${SCHEMA_PHONE}">`);

      endTag.before(tags.join("\n"), { html: true });
    });
  }
}

export async function onRequest(context) {
  const response = await context.next();

  if (context.request.method !== "GET") return response;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("text/html")) return response;

  const state = {
    isArticle: false,
    pageTitle: "",
    seenMetaTitle: false,
    seenOgTitle: false,
    seenTwitterTitle: false,
  };

  return new HTMLRewriter()
    .on('meta[property="og:type"]', new OgTypeHandler(state))
    .on("title", new BufferedTitleHandler(state))
    .on('meta[name="title"]', new AttributeTitleHandler(state, "seenMetaTitle"))
    .on('meta[property="og:title"]', new AttributeTitleHandler(state, "seenOgTitle"))
    .on('meta[name="twitter:title"]', new AttributeTitleHandler(state, "seenTwitterTitle"))
    .on('meta[itemprop="headline"]', new AttributeTitleHandler(state, "seenItempropHeadline"))
    .on('meta[name="application-name"]', new AttributeTitleHandler(state, "seenApplicationName"))
    .on('script[type="application/ld+json"]', new JsonLdHandler(state))
    .on(".blog-post-content h1", new BufferedTitleHandler(state, { articleOnly: true, recordPageTitle: false }))
    .on(".blog-card h2", new BufferedTitleHandler(state, { recordPageTitle: false }))
    .on("head", new HeadHandler(state))
    .transform(response);
}
