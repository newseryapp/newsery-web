import { CTA, NAV_ITEMS, SECTIONS } from "./content/sections.js";

const $left = document.getElementById("js-leftnav");
const $stream = document.getElementById("js-stream");
const $right = document.getElementById("js-right");
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

  $left.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-n]");
    if (!a) return;

    e.preventDefault();
    const n = Number(a.dataset.n);
    const target = document.getElementById(sectionId(n));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
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

function setupCtaTracking() {
  const handleCtaClick = (e) => {
    const cta = e.target.closest("a.ls-ctaLink[data-cta-location]");
    if (!cta) return;
    trackOpenWebCtaClick(cta.dataset.ctaLocation);
  };

  $stream.addEventListener("click", handleCtaClick);
  $right.addEventListener("click", handleCtaClick);
}

function setActiveNav(n) {
  const links = $left.querySelectorAll("a[data-n]");
  links.forEach((a) => a.classList.toggle("active", Number(a.dataset.n) === n));
}

function setupActiveObserver() {
  const sections = Array.from($stream.querySelectorAll("[data-n]"));
  if (!sections.length) return;

  const io = new IntersectionObserver(
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

  sections.forEach((s) => io.observe(s));

  // İlk aktif state
  setActiveNav(1);
}

function init() {
  if (!$left || !$stream || !$right) return;

  renderLeftNav();
  renderCenter();
  renderRightPanel();
  setupCtaTracking();
  setupActiveObserver();
}

init();
