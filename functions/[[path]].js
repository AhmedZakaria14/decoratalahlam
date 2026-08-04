const DEFAULT_HEADING = "نبذة مختصرة عن محتوى المقال";

const ARTICLE_HEADINGS = new Map([
  ["/shipboard-riyadh", "نبذة عن خدمات معلم شيبورد الرياض"],
  ["/shipboard-riyadh.html", "نبذة عن خدمات معلم شيبورد الرياض"],
  ["/paints-east-riyadh", "نبذة عن خدمات معلم دهانات شرق الرياض"],
  ["/paints-east-riyadh.html", "نبذة عن خدمات معلم دهانات شرق الرياض"],
  ["/paints-north-riyadh", "نبذة عن خدمات معلم دهانات شمال الرياض"],
  ["/paints-north-riyadh.html", "نبذة عن خدمات معلم دهانات شمال الرياض"],
]);

function normalizeHeading(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/:+$/, "")
    .toLowerCase();
}

function cleanDescription(value) {
  return String(value ?? "")
    .trim()
    .replace(/^["“”«»]+\s*/, "")
    .replace(/\s*["“”«»]+$/, "")
    .trim();
}

class MetaDescriptionHeadingHandler {
  constructor(state, replacement) {
    this.state = state;
    this.replacement = replacement;
    this.buffer = "";
  }

  element() {
    this.buffer = "";
  }

  text(text) {
    this.buffer += text.text;
    text.remove();

    if (!text.lastInTextNode) return;

    if (normalizeHeading(this.buffer) === "meta description") {
      text.after(this.replacement);
      this.state.cleanNextParagraph = true;
      this.state.replaced = true;
    } else {
      text.after(this.buffer);
    }

    this.buffer = "";
  }
}

class DescriptionParagraphHandler {
  constructor(state) {
    this.state = state;
    this.buffer = "";
    this.active = false;
  }

  element() {
    this.buffer = "";
    this.active = this.state.cleanNextParagraph;
  }

  text(text) {
    if (!this.active) return;

    this.buffer += text.text;
    text.remove();

    if (!text.lastInTextNode) return;

    text.after(cleanDescription(this.buffer));
    this.state.cleanNextParagraph = false;
    this.active = false;
    this.buffer = "";
  }
}

export async function onRequest(context) {
  const response = await context.next();

  if (context.request.method !== "GET") return response;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("text/html")) return response;

  const pathname = new URL(context.request.url).pathname;
  const replacement = ARTICLE_HEADINGS.get(pathname) || DEFAULT_HEADING;
  const state = {
    cleanNextParagraph: false,
    replaced: false,
  };

  return new HTMLRewriter()
    .on(".blog-post-content .post-body h2", new MetaDescriptionHeadingHandler(state, replacement))
    .on(".blog-post-content .post-body p", new DescriptionParagraphHandler(state))
    .transform(response);
}
