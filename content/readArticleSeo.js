const DEFAULT_SITE_ORIGIN = "https://newsery.app";
const DEFAULT_PUBLISHER_NAME = "Newsery";
const DEFAULT_AUTHOR_NAME = "Newsery Editorial";

function asText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function ensureLeadingSlash(path) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function ensureTrailingSlash(path) {
  if (!path || path.endsWith("/")) return path || "/";
  return `${path}/`;
}

function normalizePathPart(pathname) {
  return ensureTrailingSlash(ensureLeadingSlash(pathname || "/"));
}

function normalizeCanonicalPath(canonicalPath, slug) {
  const rawPath = asText(canonicalPath);
  if (rawPath) {
    if (/^https?:\/\//i.test(rawPath)) {
      try {
        const url = new URL(rawPath);
        const pathname = normalizePathPart(url.pathname);
        return `${pathname}${url.search}${url.hash}`;
      } catch (_) {
        // Fall through to path normalization below.
      }
    }

    const queryOrHashIndex = rawPath.search(/[?#]/);
    if (queryOrHashIndex >= 0) {
      const pathname = normalizePathPart(rawPath.slice(0, queryOrHashIndex));
      const suffix = rawPath.slice(queryOrHashIndex);
      return `${pathname}${suffix}`;
    }

    return normalizePathPart(rawPath);
  }

  const safeSlug = asText(slug);
  if (!safeSlug) return "/";
  return `/blog/${safeSlug}/`;
}

export function buildReadArticleCanonicalUrl(article, siteOrigin = "") {
  if (!article || typeof article !== "object") return null;

  const rawCanonicalPath = asText(article.canonicalPath);
  if (/^https?:\/\//i.test(rawCanonicalPath)) return rawCanonicalPath;

  const canonicalPath = normalizeCanonicalPath(rawCanonicalPath, article.slug);
  const origin = asText(siteOrigin);
  if (!origin) return null;

  try {
    return new URL(canonicalPath, origin).toString();
  } catch (_) {
    return null;
  }
}

export function buildReadArticleMeta(article, options = {}) {
  if (!article || typeof article !== "object") {
    return {
      title: "",
      description: "",
      canonicalPath: "/",
    };
  }

  const title = asText(article.metaTitle) || asText(article.title);
  const description = asText(article.metaDescription) || asText(article.excerpt);
  const canonicalPath = normalizeCanonicalPath(article.canonicalPath, article.slug);
  const canonicalUrl = buildReadArticleCanonicalUrl(article, options.siteOrigin);
  const robots = asText(options.robots) || asText(article.robots);

  return {
    title,
    description,
    canonicalPath,
    ...(canonicalUrl ? { canonicalUrl } : {}),
    ...(robots ? { robots } : {}),
    // Future-friendly OG mirrors for later head tag wiring.
    ogTitle: title,
    ogDescription: description,
    ...(canonicalUrl ? { ogUrl: canonicalUrl } : {}),
  };
}

function serializeListItems(items, ordered = false) {
  if (!Array.isArray(items) || !items.length) return "";
  return items
    .map((item, index) => {
      const text = asText(item);
      if (!text) return "";
      if (!ordered) return `- ${text}`;
      return `${index + 1}. ${text}`;
    })
    .filter(Boolean)
    .join("\n");
}

function extractReadArticleFaqEntriesFromBlocks(blocks) {
  if (!Array.isArray(blocks) || !blocks.length) return [];

  const faqStartIndex = blocks.findIndex(
    (block) => block?.kind === "h2" && /faq/i.test(asText(block.text))
  );
  if (faqStartIndex < 0) return [];

  const faqEntries = [];
  let currentQuestion = "";
  let answerParts = [];

  const flushCurrent = () => {
    if (!currentQuestion) return;
    const answer = answerParts.join("\n\n").trim();
    if (!answer) return;
    faqEntries.push({
      question: currentQuestion,
      answer,
    });
  };

  for (let i = faqStartIndex + 1; i < blocks.length; i += 1) {
    const block = blocks[i];
    const kind = asText(block?.kind);

    if (kind === "h2") {
      flushCurrent();
      break;
    }

    if (kind === "h3") {
      flushCurrent();
      currentQuestion = asText(block?.text);
      answerParts = [];
      continue;
    }

    if (!currentQuestion) continue;

    if (kind === "p") {
      const paragraph = asText(block?.text);
      if (paragraph) answerParts.push(paragraph);
      continue;
    }

    if (kind === "ul" || kind === "ol") {
      const listText = serializeListItems(block?.items, kind === "ol");
      if (listText) answerParts.push(listText);
    }
  }

  flushCurrent();
  return faqEntries;
}

export function extractReadArticleFaqEntries(article) {
  if (!article || typeof article !== "object") return [];

  if (Array.isArray(article.faq) && article.faq.length) {
    return article.faq
      .map((item) => {
        const question = asText(item?.question);
        const answer = Array.isArray(item?.answer)
          ? item.answer.map((part) => asText(part)).filter(Boolean).join("\n\n")
          : asText(item?.answer);
        if (!question || !answer) return null;
        return { question, answer };
      })
      .filter(Boolean);
  }

  return extractReadArticleFaqEntriesFromBlocks(article.blocks);
}

export function buildReadArticleFaqJsonLd(article) {
  const faqEntries = extractReadArticleFaqEntries(article);
  if (!faqEntries.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildReadArticleJsonLd(article, options = {}) {
  if (!article || typeof article !== "object") return null;

  const meta = buildReadArticleMeta(article, options);
  const publishedAt = asText(article.publishedAt);
  const updatedAt = asText(article.updatedAt) || publishedAt;
  const authorName =
    asText(article.authorName) || asText(article.source) || DEFAULT_AUTHOR_NAME;
  const publisherName = asText(options.publisherName) || DEFAULT_PUBLISHER_NAME;
  const publisherUrl =
    asText(options.publisherUrl) || asText(options.siteOrigin) || DEFAULT_SITE_ORIGIN;
  const schemaType = asText(options.schemaType) || "BlogPosting";
  const keywords = Array.isArray(article.tags)
    ? article.tags.map((tag) => asText(tag)).filter(Boolean).join(", ")
    : "";

  const mainEntityId = meta.canonicalUrl || meta.canonicalPath;

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: meta.title || asText(article.title),
    description: meta.description,
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    ...(updatedAt ? { dateModified: updatedAt } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": mainEntityId,
    },
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      ...(publisherUrl ? { url: publisherUrl } : {}),
    },
    ...(keywords ? { keywords } : {}),
  };
}
