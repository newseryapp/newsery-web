import { CTA, NAV_ITEMS, SECTIONS } from "./content/sections.js";

const $left = document.getElementById("js-leftnav");
const $stream = document.getElementById("js-stream");
const $right = document.getElementById("js-right");
const $authModal = document.getElementById("js-authModal");
const $authFrame = document.getElementById("js-authFrame");

const AUTH_LINK_SELECTOR = 'a[href^="/auth/?intent="]';
const AUTH_MESSAGE_TYPE = "newsery-auth";
const WEB_APP_ORIGIN = "https://app.newsery.app";
const MOBILE_DOWNLOAD_PATH = "/download.html";

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
  const hiddenCenterSectionNos = new Set([6, 9]);
  const centerSections = SECTIONS.filter((s) => !hiddenCenterSectionNos.has(s.n));

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
            <a class="btn primary" href="${CTA.web.href}">${escapeHtml(s.centerCtaLabel || CTA.web.label)}</a>
          </div>
        </section>
      `;
    }

    const isHeroSection = s.n === 1;
    const ctas = s.showCenterCtas
      ? `
        <div class="ls-ctaRow">
          <a class="btn primary" href="${CTA.web.href}">${escapeHtml(
            isHeroSection ? "Enter Newsery App" : CTA.web.label
          )}</a>
          ${isHeroSection ? "" : `<a class="btn" href="${CTA.mobile.href}">${escapeHtml(CTA.mobile.label)}</a>`}
        </div>
      `
      : "";

    return `
      <section class="ls-section" id="${sectionId(s.n)}" data-n="${s.n}">
        <figure class="ls-figure">
          <img src="${escapeHtml(s.image)}" alt="" loading="lazy" />
        </figure>

        ${s.title ? `<h2 class="ls-title">${escapeHtml(s.title)}</h2>` : ""}

        ${s.text ? `<p class="ls-text">${escapeHtml(s.text)}</p>` : ""}

        ${ctas}
      </section>
    `;
  }).join("");

  $stream.innerHTML = html;
}

function renderRightPanel() {
  $right.innerHTML = `
    <div class="ls-rightGateway">
      <a class="btn primary ls-rightGatewayCta" href="${CTA.web.href}">Enter Newsery App</a>
      <p class="ls-rightGatewaySupport">
        <span class="ls-rightGatewaySupportLine">Go straight to your custom news feed.</span><br />
        Read in a calmer, more focused flow.
      </p>
      <figure class="ls-rightGatewayFigure">
        <img class="ls-rightGatewayImage" src="assets/landing/M.png" alt="" loading="lazy" />
      </figure>
      <ul class="ls-rightGatewayBenefits">
        <li>Custom feed setup</li>
        <li>Focused reading flow</li>
        <li>Save articles for later</li>
      </ul>
    </div>
  `;
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

function openAuthModal(href) {
  if (!$authModal || !$authFrame || !href) return;

  let modalUrl;
  try {
    modalUrl = new URL(href, window.location.origin);
  } catch {
    return;
  }

  $authModal.hidden = false;
  document.body.classList.add("ls-modalOpen");
  $authFrame.src = modalUrl.toString();
}

function closeAuthModal() {
  if (!$authModal || !$authFrame) return;

  $authModal.hidden = true;
  document.body.classList.remove("ls-modalOpen");
  $authFrame.src = "about:blank";
}

function resolveSafeRedirectTarget(rawTarget) {
  if (typeof rawTarget !== "string" || !rawTarget) return null;

  let url;
  try {
    url = new URL(rawTarget, window.location.origin);
  } catch {
    return null;
  }

  if (url.origin === WEB_APP_ORIGIN) return url.toString();

  if (url.origin === window.location.origin && url.pathname === MOBILE_DOWNLOAD_PATH) {
    return url.toString();
  }

  return null;
}

function setupAuthModalFlow() {
  if (!$authModal || !$authFrame) return;

  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;

    const cta = e.target.closest(AUTH_LINK_SELECTOR);
    if (!cta) return;

    e.preventDefault();
    const href = cta.getAttribute("href") || "";
    openAuthModal(href);
  });

  $authModal.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;
    if (e.target.closest("[data-auth-close]")) closeAuthModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$authModal.hidden) closeAuthModal();
  });

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (!event.data || typeof event.data !== "object") return;
    if (event.data.type !== AUTH_MESSAGE_TYPE || event.data.status !== "success") return;

    const targetUrl = resolveSafeRedirectTarget(event.data.targetUrl);
    if (!targetUrl) return;

    closeAuthModal();
    window.location.assign(targetUrl);
  });
}

function init() {
  if (!$left || !$stream || !$right) return;

  renderLeftNav();
  renderCenter();
  renderRightPanel();
  setupActiveObserver();
  setupAuthModalFlow();
}

init();
