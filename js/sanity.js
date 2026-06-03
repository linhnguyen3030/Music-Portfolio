(function () {
  const config = window.SANITY_CONFIG;
  if (!config?.projectId) return;

  const token =
    document.querySelector('meta[name="sanity-token"]')?.getAttribute("content") ||
    config.token ||
    "";

  const PORTFOLIO_QUERY = `{
    "settings": *[_type == "siteSettings"][0]{
      heroNameLine1,
      heroNameLine2,
      heroSubtitle,
      email,
      contactNote,
      footerLocation,
      footerWebsite,
      reelUrl,
      "heroBg": heroBackground.asset->url,
      socialLinks[]{ label, url }
    },
    "about": *[_type == "about"][0]{
      previewParagraphs,
      fullBio,
      "photoUrl": photo.asset->url
    },
    "projects": *[_type == "project"] | order(coalesce(order, 999) asc, title asc) {
      title,
      "slug": slug.current,
      description,
      "thumbUrl": thumbnail.asset->url,
      "video1": video1.asset->url,
      "video2": video2.asset->url,
      "video3": video3.asset->url,
      instagramUrl
    }
  }`;

  function useLocalProxy() {
    if (window.SANITY_CONFIG?.skipProxy) return false;
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1";
  }

  function buildQueryUrl() {
    const params = new URLSearchParams({ query: PORTFOLIO_QUERY });
    if (useLocalProxy()) {
      return `/api/sanity?${params}`;
    }
    const host = config.useCdn
      ? `${config.projectId}.apicdn.sanity.io`
      : `${config.projectId}.api.sanity.io`;
    return `https://${host}/v${config.apiVersion}/data/query/${config.dataset}?${params}`;
  }

  async function fetchPortfolio() {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(buildQueryUrl(), { headers });
    if (!res.ok) throw new Error(`Sanity query failed (${res.status})`);
    const json = await res.json();
    return json.result;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderSettings(s) {
    if (!s) return;
    const heroName = document.querySelector(".hero-name");
    if (heroName && (s.heroNameLine1 || s.heroNameLine2)) {
      const l1 = escapeHtml(s.heroNameLine1 || "");
      const l2 = escapeHtml(s.heroNameLine2 || "");
      heroName.innerHTML = `${l1}<br>${l2}`;
    }
    const heroSub = document.querySelector(".hero-sub");
    if (heroSub && s.heroSubtitle) heroSub.textContent = s.heroSubtitle;
    if (s.heroBg) {
      const hero = document.querySelector(".hero");
      if (hero) {
        hero.style.background = `
          linear-gradient(to top, rgba(10,10,9,0.92) 0%, rgba(10,10,9,0.55) 45%, rgba(10,10,9,0.3) 100%),
          url('${s.heroBg}') center 30% / cover no-repeat,
          #0d0d0c`;
      }
    }
    if (s.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
        a.href = `mailto:${s.email}`;
        if (a.classList.contains("contact-email")) a.textContent = s.email;
      });
    }
    const contactNote = document.querySelector(".contact-note");
    if (contactNote && s.contactNote) contactNote.textContent = s.contactNote;
    const footer = document.querySelector(".footer-sig");
    if (footer) {
      const name =
        [s.heroNameLine1, s.heroNameLine2].filter(Boolean).join(" ") || "Steven Garza";
      const loc = s.footerLocation || "Austin, Texas";
      const web = s.footerWebsite || "stevengarza.live";
      footer.innerHTML = `${escapeHtml(name)} &ensp;·&ensp; ${escapeHtml(loc)} &ensp;·&ensp; ${escapeHtml(web)}`;
    }
    const reelBtn = document.querySelector(".reel-embed .play-btn");
    if (reelBtn && s.reelUrl) {
      reelBtn.onclick = () => window.open(s.reelUrl, "_blank");
    }
    const socialContainer = document.querySelector(".social-links");
    if (socialContainer && s.socialLinks?.length) {
      socialContainer.innerHTML = s.socialLinks
        .map(
          (link) => `
        <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener" class="social-link">
          <span class="social-link-icon"></span>
          ${escapeHtml(link.label)}
        </a>`
        )
        .join("");
    }
  }

  function renderAbout(a) {
    if (!a) return;
    const aboutText = document.querySelector(".about-text");
    if (aboutText && a.previewParagraphs?.length) {
      aboutText.innerHTML = a.previewParagraphs
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("");
    }
    const bioField = document.querySelector(".about-bio-text");
    if (bioField && a.fullBio) bioField.value = a.fullBio;
    if (a.photoUrl) {
      const placeholder = document.querySelector(".about-photo-placeholder");
      if (placeholder) {
        let img = placeholder.querySelector("img");
        if (!img) {
          img = document.createElement("img");
          placeholder.appendChild(img);
        }
        img.src = a.photoUrl;
        const icon = placeholder.querySelector(".collage-icon");
        const label = placeholder.querySelector(".collage-label");
        if (icon) icon.style.display = "none";
        if (label) label.style.display = "none";
      }
    }
  }

  function renderProjects(projects) {
    if (!projects?.length) return;

    window.mediaRegistry = window.mediaRegistry || {};

    const list = document.querySelector(".playing-list");
    const bandPages = document.getElementById("band-pages");
    if (!list || !bandPages) return;

    list.innerHTML = "";
    bandPages.innerHTML = "";

    projects.forEach((p) => {
      const slug = p.slug;
      if (!slug) return;

      window.mediaRegistry[slug] = [p.video1 || null, p.video2 || null, p.video3 || null];

      const thumbStyle = p.thumbUrl
        ? `style="background-image:url('${p.thumbUrl}');background-size:cover;background-position:center;"`
        : "";

      list.insertAdjacentHTML(
        "beforeend",
        `<li class="band-row" onclick="showPage('${escapeHtml(slug)}')">
          <div class="band-thumb" ${thumbStyle}></div>
          <span>${escapeHtml(p.title)}</span>
        </li>`
      );

      const desc = p.description
        ? escapeHtml(p.description)
        : "Add a short description — genre, vibe, what you do with this band...";

      bandPages.insertAdjacentHTML(
        "beforeend",
        `<div class="band-page" id="page-${escapeHtml(slug)}">
          <div class="band-page-header">
            <button class="back-btn" onclick="hidePage()">← Back</button>
            <h2 class="band-page-title">${escapeHtml(p.title)}</h2>
          </div>
          <div style="padding: 0.5rem 1.5rem 0;">
            <p class="band-desc band-desc--static">${desc}</p>
            ${p.instagramUrl ? `<a href="${escapeHtml(p.instagramUrl)}" target="_blank" rel="noopener" class="social-link" style="margin-top:0.5rem;display:inline-block;">Instagram →</a>` : ''}
          </div>
          <div class="collage-wrap">
            <div class="collage">
              ${[0, 1, 2]
                .map(
                  (i) => `
              <div class="collage-item" onclick="openLightbox('${escapeHtml(slug)}',${i})">
                <div class="collage-icon">▶</div>
                <span class="collage-label">Video</span>
              </div>`
                )
                .join("")}
            </div>
          </div>
        </div>`
      );
    });
  }

  function observeFadeIns() {
    document.querySelectorAll(".fade-in:not(.visible)").forEach((el) => {
      if (window.__fadeObserver) window.__fadeObserver.observe(el);
    });
  }

  async function init() {
    try {
      const data = await fetchPortfolio();
      renderSettings(data.settings);
      renderAbout(data.about);
      renderProjects(data.projects);
      observeFadeIns();
    } catch (err) {
      console.warn(
        "[Sanity] Using static HTML fallback:",
        err.message,
        useLocalProxy()
          ? ""
          : "— Add http://localhost:3000 (and your live site URL) under Sanity → API → CORS origins."
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
