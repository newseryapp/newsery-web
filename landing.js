import { CTA, NAV_ITEMS, SECTIONS } from "./content/sections.js";
import { READ_ARTICLES } from "./content/readArticles.js";
import {
  buildReadArticleFaqJsonLd,
  buildReadArticleJsonLd,
  buildReadArticleMeta,
} from "./content/readArticleSeo.js";

const $left = document.getElementById("js-leftnav");
const $stream = document.getElementById("js-stream");
const $right = document.getElementById("js-right");
const $menuToggle = document.getElementById("js-menuToggle");
const $drawer = document.getElementById("js-drawer");
const $drawerOverlay = document.getElementById("js-drawerOverlay");
const $drawerClose = document.getElementById("js-drawerClose");
const WHY_EXISTS_BOLD_SENTENCE = "Newsery was born from a simple idea: news can be calmer—without losing what matters.";
const SYSTEM_BOLD_HEADINGS = [
  "A structured filtering pipeline",
  "Strict categorization by design",
  "Quality signals and reliability checks",
  "What this means for your feed",
];
const PRIVACY_BOLD_HEADINGS = [
  "Privacy and transparency by design",
  "Continuous improvement",
];
const HERO_OVERLAY_COPY = {
  eyebrow: "Your personal news app",
  title: "A new way to read the news",
  sub: "No algorhythms, no endless feeds, no irrelevant news. Less noise, more clarity.",
  calloutLead: "Newsery",
  calloutTail: " offers a more focused, intentional way to read the news.",
};
const HERO_BODY_COPY = `At the core of Newsery is a curation system designed to reduce noise.
Categories are filtered, balanced, and kept intentionally clean so your feed stays readable and focused. You stay in control of what you follow, while the reading experience remains calmer and more organized.`;
const CTA_OPEN_WEB_EVENT_NAME = "cta_open_web_click";
const CTA_LOCATION_PARAM_NAME = "cta_location";
const VIEW_HOME = "home";
const VIEW_READ = "read";
const VIEW_ABOUT = "about";
const VIEW_PRIVACY = "privacy";
const ROUTE_VIEW_PARAM = "view";
const ROUTE_ARTICLE_PARAM = "article";
const READ_ARTICLE_JSONLD_SCRIPT_ID = "newsery-read-article-jsonld";
const READ_FAQ_JSONLD_SCRIPT_ID = "newsery-read-faq-jsonld";
const VIEW_COPY = {
  [VIEW_ABOUT]: {
    title: "About",
    text: "About content will be added next. This placeholder confirms navigation structure and view switching.",
  },
  [VIEW_PRIVACY]: {
    title: "Privacy",
    text: "Privacy page content will be added next. This placeholder confirms navigation structure and view switching.",
  },
};
const uiState = {
  drawerOpen: false,
  activeView: VIEW_HOME,
  selectedReadArticleId: READ_ARTICLES[0]?.id ?? "",
};

let activeObserver = null;
let leftNavClickBound = false;
let ctaTrackingBound = false;
let deepLinkRoutingBound = false;
const DEFAULT_HEAD_STATE = captureDefaultHeadState();

function escapeHtml(s = "") {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sectionId(n) {
  return `section-${n}`;
}

function trackOpenWebCtaClick(location) {
  if (!location || typeof window.gtag !== "function") return;

  try {
    window.gtag("event", CTA_OPEN_WEB_EVENT_NAME, {
      [CTA_LOCATION_PARAM_NAME]: location,
    });
  } catch (_) {
    // Fail-safe: never block CTA navigation if analytics is unavailable.
  }
}

function captureDefaultHeadState() {
  const description = document
    .head
    .querySelector('meta[name="description"]')
    ?.getAttribute("content") ?? "";
  const canonicalHref = document
    .head
    .querySelector('link[rel="canonical"]')
    ?.getAttribute("href") ?? "/";

  return {
    title: document.title ?? "",
    description,
    canonicalHref,
  };
}

function getSeoSiteOrigin() {
  const canonicalHref = DEFAULT_HEAD_STATE.canonicalHref ?? "";
  if (/^https?:\/\//i.test(canonicalHref)) {
    try {
      return new URL(canonicalHref).origin;
    } catch (_) {
      // Fallback to window location.
    }
  }

  return window.location?.origin ?? "";
}

function upsertMetaDescription(content) {
  let tag = document.head.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content ?? "");
}

function upsertCanonicalLink(href) {
  let tag = document.head.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", href ?? "/");
}

function removeJsonLdScript(scriptId) {
  const script = document.getElementById(scriptId);
  if (script) script.remove();
}

function upsertJsonLdScript(scriptId, payload) {
  if (!payload) {
    removeJsonLdScript(scriptId);
    return;
  }

  let script = document.getElementById(scriptId);
  if (!script) {
    script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(payload);
}

function restoreDefaultHeadMetadata() {
  document.title = DEFAULT_HEAD_STATE.title;
  upsertMetaDescription(DEFAULT_HEAD_STATE.description);
  upsertCanonicalLink(DEFAULT_HEAD_STATE.canonicalHref);
  removeJsonLdScript(READ_ARTICLE_JSONLD_SCRIPT_ID);
  removeJsonLdScript(READ_FAQ_JSONLD_SCRIPT_ID);
}

function applyReadArticleHeadMetadata(article) {
  if (!article) {
    restoreDefaultHeadMetadata();
    return;
  }

  const seoOptions = { siteOrigin: getSeoSiteOrigin() };
  const meta = buildReadArticleMeta(article, seoOptions);

  document.title = meta.title || DEFAULT_HEAD_STATE.title;
  upsertMetaDescription(meta.description || DEFAULT_HEAD_STATE.description);
  upsertCanonicalLink(meta.canonicalUrl || meta.canonicalPath || DEFAULT_HEAD_STATE.canonicalHref);

  const articleJsonLd = buildReadArticleJsonLd(article, seoOptions);
  const faqJsonLd = buildReadArticleFaqJsonLd(article);
  upsertJsonLdScript(READ_ARTICLE_JSONLD_SCRIPT_ID, articleJsonLd);
  upsertJsonLdScript(READ_FAQ_JSONLD_SCRIPT_ID, faqJsonLd);
}

function setDrawerOpen(nextOpen) {
  if (!$drawer || !$drawerOverlay || !$menuToggle) return;

  uiState.drawerOpen = Boolean(nextOpen);
  $drawer.classList.toggle("is-open", uiState.drawerOpen);
  $drawerOverlay.hidden = !uiState.drawerOpen;
  $drawer.setAttribute("aria-hidden", String(!uiState.drawerOpen));
  $menuToggle.setAttribute("aria-expanded", String(uiState.drawerOpen));
  $menuToggle.setAttribute("aria-label", uiState.drawerOpen ? "Close menu" : "Open menu");
  document.body.classList.toggle("drawer-open", uiState.drawerOpen);
}

function renderDrawerActiveState() {
  if (!$drawer) return;
  const buttons = $drawer.querySelectorAll(".ls-drawerItem[data-view]");
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === uiState.activeView);
  });
}

function getReadArticleById(articleId) {
  return READ_ARTICLES.find((article) => article.id === articleId) ?? null;
}

function getReadArticleBySlug(slug) {
  const normalizedSlug = String(slug ?? "").trim().toLowerCase();
  if (!normalizedSlug) return null;

  return (
    READ_ARTICLES.find((article) => String(article.slug ?? "").trim().toLowerCase() === normalizedSlug) ?? null
  );
}

function buildReadArticleHref(article) {
  const params = new URLSearchParams();
  params.set(ROUTE_VIEW_PARAM, VIEW_READ);

  const slug = String(article?.slug ?? "").trim();
  if (slug) params.set(ROUTE_ARTICLE_PARAM, slug);

  return `?${params.toString()}`;
}

function getRouteHashArticleSlug() {
  const hash = String(window.location.hash ?? "");
  const match = hash.match(/^#read\/([^/?#]+)/i);
  return match ? decodeURIComponent(match[1]) : "";
}

function parseDeepLinkStateFromLocation() {
  const url = new URL(window.location.href);
  const viewParam = String(url.searchParams.get(ROUTE_VIEW_PARAM) ?? "").trim().toLowerCase();
  const articleParamSlug = String(url.searchParams.get(ROUTE_ARTICLE_PARAM) ?? "").trim();
  const hashSlug = getRouteHashArticleSlug();
  const wantsReadView = viewParam === VIEW_READ || Boolean(hashSlug);
  const fallbackArticleId = READ_ARTICLES[0]?.id ?? "";

  if (!wantsReadView) {
    const hasUnsupportedParams = Boolean(viewParam || articleParamSlug);
    return {
      activeView: VIEW_HOME,
      selectedReadArticleId: fallbackArticleId,
      shouldNormalizeUrl: hasUnsupportedParams,
    };
  }

  const slugCandidate = articleParamSlug || hashSlug;
  const matchedArticle = getReadArticleBySlug(slugCandidate);
  const selectedReadArticleId = matchedArticle?.id ?? fallbackArticleId;
  const shouldNormalizeFromInvalidOrMissingSlug = !matchedArticle || !slugCandidate;
  const shouldNormalizeFromHashRouting = Boolean(hashSlug);
  const shouldNormalizeFromNonCanonicalSlug =
    Boolean(matchedArticle && slugCandidate && slugCandidate !== matchedArticle.slug);

  return {
    activeView: VIEW_READ,
    selectedReadArticleId,
    shouldNormalizeUrl:
      shouldNormalizeFromInvalidOrMissingSlug ||
      shouldNormalizeFromHashRouting ||
      shouldNormalizeFromNonCanonicalSlug,
  };
}

function buildUrlFromUiState() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const hash = /^#read\//i.test(url.hash) ? "" : url.hash;

  if (uiState.activeView === VIEW_READ) {
    params.set(ROUTE_VIEW_PARAM, VIEW_READ);
    const selectedArticle = getReadArticleById(uiState.selectedReadArticleId) ?? READ_ARTICLES[0] ?? null;
    const selectedSlug = String(selectedArticle?.slug ?? "").trim();
    if (selectedSlug) params.set(ROUTE_ARTICLE_PARAM, selectedSlug);
    else params.delete(ROUTE_ARTICLE_PARAM);
  } else {
    params.delete(ROUTE_VIEW_PARAM);
    params.delete(ROUTE_ARTICLE_PARAM);
  }

  const search = params.toString();
  return `${url.pathname}${search ? `?${search}` : ""}${hash}`;
}

function syncUrlWithUiState(historyMode = "push") {
  const nextUrl = buildUrlFromUiState();
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl === currentUrl) return;

  const historyState = {
    view: uiState.activeView,
    articleId: uiState.selectedReadArticleId,
  };

  if (historyMode === "replace") {
    window.history.replaceState(historyState, "", nextUrl);
    return;
  }

  window.history.pushState(historyState, "", nextUrl);
}

function applyUiStateFromLocation(options = {}) {
  const { normalizeHistoryMode = null } = options;
  const parsed = parseDeepLinkStateFromLocation();
  uiState.activeView = parsed.activeView;

  if (parsed.activeView === VIEW_READ) {
    uiState.selectedReadArticleId = parsed.selectedReadArticleId;
  }

  renderDrawerActiveState();
  renderActiveView();

  if (normalizeHistoryMode && parsed.shouldNormalizeUrl) {
    syncUrlWithUiState(normalizeHistoryMode);
  }
}

function setupDeepLinkRouting() {
  if (deepLinkRoutingBound) return;

  window.addEventListener("popstate", () => {
    applyUiStateFromLocation();
  });

  deepLinkRoutingBound = true;
}

function renderLeftNav() {
  const links = NAV_ITEMS.map((item) => {
    const id = sectionId(item.n);
    return `
      <a href="#${id}" data-n="${item.n}">
        <span class="ls-num">${String(item.n).padStart(2, "0")}</span>
        <span>${escapeHtml(item.label)}</span>
      </a>
    `;
  }).join("");

  $left.classList.add("ls-nav");
  $left.innerHTML = links;
}

function handleLeftNavClick(e) {
  const readCard = e.target.closest("[data-read-id]");
  if (readCard && uiState.activeView === VIEW_READ) {
    if (
      readCard.tagName === "A" &&
      (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
    ) {
      return;
    }

    if (readCard.tagName === "A") {
      e.preventDefault();
    }

    const nextArticleId = readCard.dataset.readId;
    if (nextArticleId && nextArticleId !== uiState.selectedReadArticleId) {
      uiState.selectedReadArticleId = nextArticleId;
      renderReadLeftPanel();
      renderReadCenterPanel();
      syncUrlWithUiState("push");
    }
    return;
  }

  const a = e.target.closest("a[data-n]");
  if (!a) return;

  e.preventDefault();
  const n = Number(a.dataset.n);
  const target = document.getElementById(sectionId(n));
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCenter() {
  const centerSectionOrder = [1, 2, 5, 3, 4, 7, 8];
  const centerSections = centerSectionOrder
    .map((sectionNo) => SECTIONS.find((s) => s.n === sectionNo))
    .filter(Boolean);

  const html = centerSections.map((s) => {
    if (s.kind === "how-desktop" || s.kind === "how-mobile") {
      const stepsHtml = (s.steps ?? [])
        .map(
          (step) => `
            <figure class="ls-figure">
              <img src="${escapeHtml(step.image ?? "")}" alt="" loading="lazy" />
            </figure>

            ${step.captionTitle ? `<h3 class="ls-title">${escapeHtml(step.captionTitle)}</h3>` : ""}

            ${step.captionText ? `<p class="ls-text">${escapeHtml(step.captionText)}</p>` : ""}
          `
        )
        .join("");

      return `
        <section class="ls-section" id="${sectionId(s.n)}" data-n="${s.n}">
          ${s.title ? `<h2 class="ls-title">${escapeHtml(s.title)}</h2>` : ""}

          ${s.intro ? `<p class="ls-text">${escapeHtml(s.intro)}</p>` : ""}

          ${stepsHtml}

          <div class="ls-ctaRow">
            <a class="btn primary ls-ctaLink" data-cta-location="${s.kind === "how-desktop" ? "how_desktop" : "how_mobile"}" href="${CTA.web.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.centerCtaLabel || CTA.web.label)}</a>
          </div>
        </section>
      `;
    }

    const isHeroSection = s.n === 1;
    const webCtaLocation = isHeroSection ? "hero" : `section_${s.n}`;
    const ctas = s.showCenterCtas
      ? `
        <div class="ls-ctaRow">
          <a class="btn primary ls-ctaLink" data-cta-location="${webCtaLocation}" href="${CTA.web.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(
            isHeroSection ? "Open Newsery App" : CTA.web.label
          )}</a>
          ${isHeroSection ? "" : `<a class="btn ls-ctaLink" href="${CTA.mobile.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(CTA.mobile.label)}</a>`}
        </div>
      `
      : "";

    const heroFigureClass = isHeroSection ? "ls-figure ls-heroFigure" : "ls-figure";
    const heroOverlay = isHeroSection
      ? `
        <div class="ls-heroOverlay" aria-hidden="true">
          <p class="ls-heroEyebrow">${escapeHtml(HERO_OVERLAY_COPY.eyebrow)}</p>
          <h2 class="ls-heroHeading">${escapeHtml(HERO_OVERLAY_COPY.title)}</h2>
          <p class="ls-heroSub">${escapeHtml(HERO_OVERLAY_COPY.sub)}</p>
          <p class="ls-heroCallout"><span class="ls-heroCalloutLead">${escapeHtml(HERO_OVERLAY_COPY.calloutLead)}</span>${escapeHtml(HERO_OVERLAY_COPY.calloutTail)}</p>
        </div>
      `
      : "";
    const sectionTitle = !isHeroSection && s.title ? `<h2 class="ls-title">${escapeHtml(s.title)}</h2>` : "";
    const formattedSectionText = (() => {
      if (!s.text) return "";
      let escaped = escapeHtml(s.text);

      if (s.n === 2) {
        const escapedTarget = escapeHtml(WHY_EXISTS_BOLD_SENTENCE);
        escaped = escaped.replace(escapedTarget, `<strong>${escapedTarget}</strong>`);
      }

      if (s.n === 5) {
        SYSTEM_BOLD_HEADINGS.forEach((heading) => {
          const escapedHeading = escapeHtml(heading);
          escaped = escaped.replace(escapedHeading, `<strong>${escapedHeading}</strong>`);
        });
      }

      if (s.n === 8) {
        PRIVACY_BOLD_HEADINGS.forEach((heading) => {
          const escapedHeading = escapeHtml(heading);
          escaped = escaped.replace(escapedHeading, `<strong>${escapedHeading}</strong>`);
        });
      }

      return escaped;
    })();
    const sectionText = !isHeroSection && formattedSectionText ? `<p class="ls-text">${formattedSectionText}</p>` : "";
    const heroBodyText = isHeroSection ? `<p class="ls-text ls-heroBodyText">${escapeHtml(HERO_BODY_COPY)}</p>` : "";

    return `
      <section class="ls-section" id="${sectionId(s.n)}" data-n="${s.n}">
        <figure class="${heroFigureClass}">
          <img src="${escapeHtml(s.image)}" alt="" loading="lazy" />
          ${heroOverlay}
        </figure>

        ${sectionTitle}

        ${sectionText}

        ${heroBodyText}

        ${ctas}
      </section>
    `;
  }).join("");

  $stream.innerHTML = html;
}

function renderRightPanel() {
  $right.innerHTML = `
    <div class="ls-rightGateway">
      <a class="btn primary ls-rightGatewayCta ls-ctaLink" data-cta-location="right_panel" href="${CTA.web.href}" target="_blank" rel="noopener noreferrer">Open Newsery App</a>
      <p class="ls-rightGatewaySupport">
        <span class="ls-rightGatewaySupportLine">Web app • Mobile-friendly</span><br />
        Use Newsery in your browser on desktop or phone.<br />
        Optimized for mobile screens for a smoother reading experience.
      </p>
      <figure class="ls-rightGatewayFigure">
        <img class="ls-rightGatewayImage" src="assets/landing/M.png" alt="" loading="lazy" />
      </figure>
      <ul class="ls-rightGatewayBenefits">
        <li>Works on desktop and mobile</li>
        <li>No install required</li>
        <li>Mobile-optimized reading flow</li>
      </ul>
    </div>
  `;
}

function renderReadLeftPanel() {
  const items = READ_ARTICLES.map((article) => {
    const isActive = article.id === uiState.selectedReadArticleId;
    const href = buildReadArticleHref(article);
    const ariaCurrent = isActive ? ' aria-current="page"' : "";
    return `
      <a
        class="ls-readCard${isActive ? " is-active" : ""}"
        href="${escapeHtml(href)}"
        data-read-id="${escapeHtml(article.id)}"
        ${ariaCurrent}
      >
        <span class="ls-readCardCategory">${escapeHtml(article.category)}</span>
        <span class="ls-readCardTitle">${escapeHtml(article.title)}</span>
        <span class="ls-readCardExcerpt">${escapeHtml(article.excerpt)}</span>
      </a>
    `;
  }).join("");

  $left.classList.remove("ls-nav");
  $left.innerHTML = `<div class="ls-readList">${items}</div>`;
}

function renderReadContentBlocks(article) {
  const blocks = Array.isArray(article.blocks)
    ? article.blocks
    : (article.body ?? []).map((text) => ({ kind: "p", text }));

  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return "";

      if (block.kind === "h2" && block.text) {
        return `<h2 class="ls-readDetailHeading">${escapeHtml(block.text)}</h2>`;
      }

      if (block.kind === "h3" && block.text) {
        return `<h3 class="ls-readDetailSubheading">${escapeHtml(block.text)}</h3>`;
      }

      if ((block.kind === "ul" || block.kind === "ol") && Array.isArray(block.items)) {
        const itemsHtml = block.items
          .map((item) => (item ? `<li>${escapeHtml(item)}</li>` : ""))
          .join("");

        if (!itemsHtml) return "";
        const listTag = block.kind === "ol" ? "ol" : "ul";
        const orderedClass = block.kind === "ol" ? " ls-readDetailListOrdered" : "";
        return `<${listTag} class="ls-readDetailList${orderedClass}">${itemsHtml}</${listTag}>`;
      }

      if (block.kind === "p" && block.text) {
        return `<p class="ls-readDetailParagraph">${escapeHtml(block.text)}</p>`;
      }

      return "";
    })
    .join("");
}

function renderReadCenterPanel() {
  const selected = getReadArticleById(uiState.selectedReadArticleId) ?? READ_ARTICLES[0] ?? null;
  if (!selected) {
    $stream.innerHTML = `
      <section class="ls-viewPlaceholder">
        <h2>Read</h2>
        <p>No articles available yet.</p>
      </section>
    `;
    restoreDefaultHeadMetadata();
    return;
  }

  const contentHtml = renderReadContentBlocks(selected);

  $stream.innerHTML = `
    <article class="ls-readDetail">
      <p class="ls-readDetailKicker">${escapeHtml(selected.category)}</p>
      <h2 class="ls-readDetailTitle">${escapeHtml(selected.title)}</h2>
      <p class="ls-readDetailMeta">${escapeHtml(selected.source)} · ${escapeHtml(selected.date)}</p>
      ${contentHtml}
    </article>
  `;

  applyReadArticleHeadMetadata(selected);
}

function renderReadView() {
  if (!getReadArticleById(uiState.selectedReadArticleId)) {
    uiState.selectedReadArticleId = READ_ARTICLES[0]?.id ?? "";
  }

  renderReadLeftPanel();
  renderReadCenterPanel();
}

function renderPlaceholderView(view) {
  const copy = VIEW_COPY[view];
  if (!copy) return;

  const placeholderHtml = `
    <section class="ls-viewPlaceholder" data-view-placeholder="${escapeHtml(view)}">
      <h2>${escapeHtml(copy.title)}</h2>
      <p>${escapeHtml(copy.text)}</p>
    </section>
  `;

  $left.classList.remove("ls-nav");
  $left.innerHTML = placeholderHtml;
  $stream.innerHTML = placeholderHtml;
}

function teardownActiveObserver() {
  if (!activeObserver) return;
  activeObserver.disconnect();
  activeObserver = null;
}

function renderActiveView() {
  document.body.dataset.view = uiState.activeView;

  if (uiState.activeView === VIEW_HOME) {
    restoreDefaultHeadMetadata();
    renderLeftNav();
    renderCenter();
    renderRightPanel();
    setupActiveObserver();
    return;
  }

  teardownActiveObserver();

  if (uiState.activeView === VIEW_READ) {
    renderReadView();
    renderRightPanel();
    return;
  }

  restoreDefaultHeadMetadata();
  renderPlaceholderView(uiState.activeView);
  renderRightPanel();
}

function setActiveView(nextView, options = {}) {
  const { syncUrl = true, historyMode = "push" } = options;
  if (!nextView || nextView === uiState.activeView) return;
  uiState.activeView = nextView;
  renderDrawerActiveState();
  renderActiveView();

  if (syncUrl) {
    syncUrlWithUiState(historyMode);
  }
}

function setupCtaTracking() {
  const handleCtaClick = (e) => {
    const cta = e.target.closest("a.ls-ctaLink[data-cta-location]");
    if (!cta) return;
    trackOpenWebCtaClick(cta.dataset.ctaLocation);
  };

  if (!ctaTrackingBound) {
    $stream.addEventListener("click", handleCtaClick);
    $right.addEventListener("click", handleCtaClick);
    ctaTrackingBound = true;
  }
}

function setActiveNav(n) {
  const links = $left.querySelectorAll("a[data-n]");
  links.forEach((a) => a.classList.toggle("active", Number(a.dataset.n) === n));
}

function setupActiveObserver() {
  teardownActiveObserver();

  const sections = Array.from($stream.querySelectorAll("[data-n]"));
  if (!sections.length) return;

  activeObserver = new IntersectionObserver(
    (entries) => {
      // En çok görüneni seç
      const visible = entries
        .filter((x) => x.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

      if (visible?.target) {
        const n = Number(visible.target.getAttribute("data-n"));
        if (Number.isFinite(n)) setActiveNav(n);
      }
    },
    {
      root: $stream,
      threshold: [0.25, 0.4, 0.6],
    }
  );

  sections.forEach((s) => activeObserver.observe(s));

  // İlk aktif state
  setActiveNav(1);
}

function setupDrawerInteractions() {
  if (!$menuToggle || !$drawer || !$drawerOverlay || !$drawerClose) return;

  $menuToggle.addEventListener("click", () => {
    setDrawerOpen(!uiState.drawerOpen);
  });

  $drawerClose.addEventListener("click", () => {
    setDrawerOpen(false);
  });

  $drawerOverlay.addEventListener("click", () => {
    setDrawerOpen(false);
  });

  $drawer.addEventListener("click", (e) => {
    const button = e.target.closest(".ls-drawerItem[data-view]");
    if (!button) return;

    const nextView = button.dataset.view;
    if (
      nextView === VIEW_HOME ||
      nextView === VIEW_READ ||
      nextView === VIEW_ABOUT ||
      nextView === VIEW_PRIVACY
    ) {
      setActiveView(nextView);
    }

    setDrawerOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && uiState.drawerOpen) {
      setDrawerOpen(false);
    }
  });
}

function init() {
  if (!$left || !$stream || !$right) return;

  if (!leftNavClickBound) {
    $left.addEventListener("click", handleLeftNavClick);
    leftNavClickBound = true;
  }

  setupCtaTracking();
  setupDrawerInteractions();
  setupDeepLinkRouting();
  setDrawerOpen(false);
  applyUiStateFromLocation({ normalizeHistoryMode: "replace" });
}

init();
