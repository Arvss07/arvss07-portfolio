/* DOSSIER SYSTEM — Classified Intelligence Portfolio */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function normalizePath(path) {
  if (!path || typeof path !== "string") return "";
  return path.replace(/^\//, "");
}

function credlyBadgeName(path) {
  const base = path.split("/").pop() || "";
  const name = base.replace(/\.[^.]+$/, "").replace(/-/g, " ");
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

function skillIconHTML(item) {
  const isObj = typeof item === "object" && item !== null;
  const label = isObj ? item.label : String(item);
  const provider = (isObj ? item.provider : "devicon") || "devicon";
  const id = (isObj ? item.id : label) || "";
  const normId = String(id).toLowerCase().replace(/\+/g, "plus").replace(/\s+/g, "");

  if (provider === "skillicons") {
    return `<img class="arsenal-icon" src="https://skillicons.dev/icons?i=${encodeURIComponent(normId)}" alt="${label}" loading="lazy"/>`;
  }
  if (provider === "simple-icons") {
    return `<img class="arsenal-icon" src="https://cdn.simpleicons.org/${encodeURIComponent(normId)}" alt="${label}" loading="lazy"/>`;
  }
  if (provider === "devicon") {
    return `<i class="devicon-${normId}-plain colored arsenal-icon"></i>`;
  }
  return `<i class="fas fa-cube arsenal-icon"></i>`;
}

const TYPE_ICONS = {
  code: "fa-terminal",
  paper: "fa-file-alt",
  others: "fa-puzzle-piece",
};

// ---------- Boot sequence ----------
function triggerBootSequence(data) {
  const boot = $("#boot");
  const app = $("#app");
  const bar = $(".boot-progress-bar", boot);
  const lines = $$(".boot-line", boot);
  const name = data.profile?.name || "SUBJECT";
  const brand = data.profile?.brand || "N/A";

  const logTexts = [
    `> Loading dossier system...`,
    `> Subject: ${name}`,
    `> Alias: ${brand}`,
    `> Verifying clearance...`,
    `> Access granted.`,
  ];

  let step = 0;
  const totalSteps = 5;
  const stepDuration = 3400 / totalSteps;

  function next() {
    if (step < totalSteps) {
      if (step < lines.length) {
        lines[step].textContent = logTexts[step];
        lines[step].classList.add("visible");
      }
      step++;
      bar.style.width = `${(step / totalSteps) * 100}%`;
      setTimeout(next, stepDuration);
    } else {
      boot.classList.add("done");
      app.style.opacity = "1";
    }
  }

  setTimeout(next, 400);
}

// ---------- Canvas node graph ----------
function initCanvas() {
  const canvas = $("#bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const nodeCount = 80;
  const proximity = 150;
  const nodeRadius = 2;
  let nodes = [];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes();
  }

  function initNodes() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }
  }

  function tick() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      n.x = Math.max(0, Math.min(w, n.x));
      n.y = Math.max(0, Math.min(h, n.y));
    });

    ctx.strokeStyle = "rgba(74, 144, 217, 0.12)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        if (dx * dx + dy * dy < proximity * proximity) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = "rgba(74, 144, 217, 0.35)";
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize);
  tick();
}

// ---------- Custom cursor ----------
function initCursor() {
  const ring = $("#cursorRing");
  const dot = $("#cursorDot");
  if (!ring || !dot) return;

  let x = 0, y = 0;
  let ringX = 0, ringY = 0;
  const lerp = 0.12;

  document.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });

  const hoverSelectors = "a, button, [role='button'], .project-card, .cert-card, .badge-tile, .arsenal-tile, .showcase-card";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverSelectors)) ring.classList.add("hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (!e.target.closest(hoverSelectors)) ring.classList.remove("hover");
  });

  function update() {
    ringX += (x - ringX) * lerp;
    ringY += (y - ringY) * lerp;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    dot.style.left = x + "px";
    dot.style.top = y + "px";
    requestAnimationFrame(update);
  }
  update();
}

// ---------- Sidebar ----------
function renderSidebar(data) {
  const profile = data.profile || {};
  $(".sidebar-subject-name").textContent = profile.name || "SUBJECT";
  $(".sidebar-brand").textContent = profile.brand || "";

  const nav = $("#sidebarNav");
  const sections = [
    { id: "section-hero", label: "SUBJECT FILE" },
    { id: "section-stats", label: "STATS" },
    { id: "section-about", label: "PROFILE" },
    { id: "section-education", label: "TIMELINE" },
    { id: "section-skills", label: "ARSENAL" },
    { id: "section-projects", label: "PROJECTS" },
    { id: "section-operations", label: "OPERATIONS" },
    { id: "section-certificates", label: "CERTIFICATES" },
    { id: "section-contact", label: "CONTACT" },
  ];
  nav.innerHTML = sections
    .map((s) => `<a href="#${s.id}" class="sidebar-link">${s.label}</a>`)
    .join("");

  const filters = $("#sidebarFilters");
  filters.innerHTML = `
    <button type="button" class="filter-btn active" data-filter="all"><i class="fas fa-layer-group"></i> All</button>
    <button type="button" class="filter-btn" data-filter="code"><i class="fas fa-terminal"></i> Code</button>
    <button type="button" class="filter-btn" data-filter="paper"><i class="fas fa-file-alt"></i> Paper</button>
    <button type="button" class="filter-btn" data-filter="others"><i class="fas fa-puzzle-piece"></i> Others</button>
  `;
}

function initSidebarToggle() {
  const toggle = $("#sidebarToggle");
  const sidebar = $("#sidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  }
}

// ---------- Dark / Light mode ----------
function initDarkLightToggle() {
  const btn = $("#darkLightToggle");
  if (!btn) return;
  const saved = localStorage.getItem("dossier-theme");
  if (saved === "declassified") document.documentElement.classList.add("declassified");
  updateToggleLabel(btn);

  btn.addEventListener("click", () => {
    const root = document.documentElement;
    root.classList.add("declassified-transition");
    root.classList.toggle("declassified");
    const isDeclassified = root.classList.contains("declassified");
    localStorage.setItem("dossier-theme", isDeclassified ? "declassified" : "classified");
    updateToggleLabel(btn);
    setTimeout(() => root.classList.remove("declassified-transition"), 480);
  });
}

function updateToggleLabel(btn) {
  const isDeclassified = document.documentElement.classList.contains("declassified");
  btn.innerHTML = isDeclassified
    ? '<i class="fas fa-sun"></i> DECLASSIFIED'
    : '<i class="fas fa-moon"></i> CLASSIFIED';
}

// ---------- Back to top ----------
function initBackToTop() {
  const btn = $("#backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    btn.classList.toggle("visible", scrollTop > 400);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ---------- Status bar ----------
function renderStatusBar(data) {
  const profile = data.profile || {};
  const contact = data.contact || {};
  $(".status-bar-name").textContent = profile.name || "";
  $(".status-bar-location").textContent = contact.location || "";
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const el = $("#liveClock");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString("en-US", { hour12: false });
  el.setAttribute("datetime", now.toISOString());
}

// ---------- Clearance progress ----------
function initClearanceBar() {
  const fill = $(".clearance-fill");
  if (!fill) return;
  function update() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    fill.style.width = pct + "%";
  }
  window.addEventListener("scroll", update);
  update();
}

// ---------- Scroll spy with progress dots ----------
function initScrollSpy() {
  const links = $$("#sidebarNav .sidebar-link");
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);

  function update() {
    const offset = 120;
    let currentId = null;
    let currentIdx = -1;
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top - offset <= 0 && rect.bottom > offset) {
        currentId = sections[i].id;
        currentIdx = i;
      }
    }
    links.forEach((a, i) => {
      const match = a.getAttribute("href") === `#${currentId}`;
      a.classList.toggle("active", !!match);
      a.classList.toggle("visited", i < currentIdx);
    });
  }
  window.addEventListener("scroll", update);
  update();
}

// ---------- IntersectionObserver ----------
function initObservers() {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in-view");
      });
    },
    { rootMargin: "0px 0px 80px 0px", threshold: 0 }
  );
  $$(".content-section").forEach((el) => sectionObserver.observe(el));

  const tileObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in-view");
      });
    },
    { threshold: 0.15 }
  );
  $$(".arsenal-category").forEach((el) => tileObserver.observe(el));
}

// ---------- Hero ----------
function renderHero(profile) {
  const name = profile?.name || "Subject";
  const parts = name.split(" ");
  const first = parts[0] || name;
  const last = parts.slice(1).join(" ") || "";
  const initials = (first[0] || "") + (last[0] || "");

  const keywords = profile?.titleKeywords || [];
  const photo = normalizePath(profile?.photo) || "images/me.jpg";
  const resume = profile?.resume || "#";
  const cv = profile?.cv || "#";
  const tags = keywords.slice(0, 3);

  return `
    <section id="section-hero" class="content-section">
      <div class="hero-left">
        <p class="hero-eyebrow">CLASSIFIED — SUBJECT FILE <span class="cursor-blink"></span></p>
        <div class="hero-name-wrap">
          <span class="hero-ghost-initials">${initials}</span>
          <span class="hero-name-first">${first}</span>
          <span class="hero-name-last">${last}</span>
        </div>
        <div class="hero-typewriter-wrap"><span id="typewriterText"></span></div>
        <div class="hero-tags">${tags.map((t) => `<span class="hero-tag">${t}</span>`).join("")}</div>
        <div class="hero-ctas">
          <a href="${resume}" class="hero-cta primary" target="_blank" rel="noopener"><i class="fas fa-download"></i> Resume</a>
          <a href="#section-contact" class="hero-cta"><i class="fas fa-satellite-dish"></i> Contact</a>
          ${cv ? `<a href="${cv}" class="hero-cta" target="_blank" rel="noopener"><i class="fas fa-id-card"></i> CV</a>` : ""}
        </div>
      </div>
      <div class="subject-file-card">
        <div class="card-image-wrap"><img src="${photo}" alt="Subject" /></div>
        <div class="card-meta">
          <div class="meta-row"><span class="meta-key">ALIAS</span><span class="meta-val">${profile?.brand || "—"}</span></div>
          <div class="meta-row"><span class="meta-key">STATUS</span><span class="meta-val">ACTIVE</span></div>
        </div>
        <span class="stamp">ACTIVE CLEARANCE</span>
      </div>
    </section>
  `;
}

function initTypewriter(keywords) {
  const el = $("#typewriterText");
  if (!el || !keywords.length) return;
  let idx = 0;
  let charIdx = 0;
  let direction = 1;
  const speed = 80;

  function tick() {
    const word = keywords[idx] || "";
    if (direction === 1) {
      charIdx++;
      el.textContent = word.slice(0, charIdx);
      if (charIdx >= word.length) { direction = -1; setTimeout(tick, 1200); return; }
    } else {
      charIdx--;
      el.textContent = word.slice(0, charIdx);
      if (charIdx <= 0) { direction = 1; idx = (idx + 1) % keywords.length; }
    }
    setTimeout(tick, direction === 1 ? speed : 40);
  }
  setTimeout(tick, 500);
}

// ---------- Stats ----------
function renderStats(data) {
  const projects = (data.projects || []).length;
  const certs = (data.certificates || []).length;
  const badges = (data.credly_badges || []).length;
  const skillsTotal = (data.skills || []).reduce((acc, s) => acc + (s.items || []).length, 0);

  return `
    <section id="section-stats" class="content-section">
      <div class="stat-cell"><span class="stat-number">${projects}<sup>+</sup></span><span class="stat-label">PROJECTS</span></div>
      <div class="stat-cell"><span class="stat-number">${certs}<sup>&times;</sup></span><span class="stat-label">CERTIFICATES</span></div>
      <div class="stat-cell"><span class="stat-number">${badges}<sup>&check;</sup></span><span class="stat-label">BADGES</span></div>
      <div class="stat-cell"><span class="stat-number">${skillsTotal}<sup>&infin;</sup></span><span class="stat-label">ARSENAL</span></div>
    </section>
  `;
}

// ---------- About / Personnel File ----------
function renderAbout(about, profile, contact) {
  if (!about) return "";
  const intro = about.intro || "";
  const paragraphs = intro.split(/\n\n+/).filter(Boolean);
  const introHtml = paragraphs.length ? paragraphs.map((p) => `<p>${p}</p>`).join("") : `<p>${intro}</p>`;
  const features = about.features || [];
  const name = profile?.name || "SUBJECT";
  const brand = profile?.brand || "—";
  const photo = normalizePath(profile?.aboutPhoto) || "images/arvy.png";
  const location = contact?.location || "—";

  const findingsHtml = features
    .map((f) => `
      <div class="pf-finding">
        <div class="pf-finding-icon"><i class="fas ${f.icon || "fa-circle"}"></i></div>
        <div>
          <div class="pf-finding-title">${f.title || ""}</div>
          <p class="pf-finding-text">${f.text || ""}</p>
        </div>
      </div>
    `)
    .join("");

  return `
    <section id="section-about" class="content-section">
      <div class="pf-header">
        <span class="pf-stamp">CLASSIFIED</span>
        <span class="pf-header-title">PERSONNEL FILE: ${name.toUpperCase()}</span>
      </div>
      <div class="pf-id-row">
        <div class="pf-photo-wrap"><img src="${photo}" alt="Subject" /></div>
        <div class="pf-meta-grid">
          <div class="pf-meta-item"><span class="pf-meta-key">DESIGNATION</span><span class="pf-meta-val">${brand}</span></div>
          <div class="pf-meta-item"><span class="pf-meta-key">STATUS</span><span class="pf-meta-val">Active</span></div>
          <div class="pf-meta-item"><span class="pf-meta-key">LOCATION</span><span class="pf-meta-val">${location}</span></div>
          <div class="pf-meta-item"><span class="pf-meta-key">CLEARANCE</span><span class="pf-meta-val">Level 4</span></div>
        </div>
      </div>
      <div class="pf-assessment">
        <p class="pf-assessment-label">SUBJECT ASSESSMENT</p>
        <div class="pf-assessment-body">${introHtml}</div>
      </div>
      <div class="pf-findings">
        <p class="pf-findings-label">CAPABILITY FINDINGS</p>
        <div class="pf-findings-grid">${findingsHtml}</div>
      </div>
    </section>
  `;
}

// ---------- Skills / Arsenal Inventory ----------
function renderSkills(skills) {
  const list = skills || [];
  let tileIdx = 0;
  const groupsHtml = list
    .map((cat) => {
      const tilesHtml = (cat.items || [])
        .map((item) => {
          const label = typeof item === "object" ? item.label : item;
          const icon = skillIconHTML(item);
          const idx = tileIdx++;
          return `<div class="arsenal-tile" style="--i:${idx % 12}">
            ${icon}
            <span class="arsenal-label">${label}</span>
          </div>`;
        })
        .join("");
      return `
        <div class="arsenal-category">
          <h3 class="arsenal-cat-title"><i class="fas ${cat.icon || "fa-code"}"></i> ${cat.name || ""}</h3>
          <div class="arsenal-grid">${tilesHtml}</div>
        </div>
      `;
    })
    .join("");

  return `
    <section id="section-skills" class="content-section">
      <p class="section-label">ARSENAL</p>
      <h2 class="section-title">Skills and Technology</h2>
      ${groupsHtml}
    </section>
  `;
}

// ---------- Projects / Case Files ----------
function getShowcaseCardHtml(p) {
  const type = p.type || "code";
  const imgSrc = normalizePath(p.image) || "";
  const title = p.title || "Untitled";
  const link = (p.resource_links && p.resource_links.length)
    ? (p.resource_links.find((l) => l.url) || {}).url || "#"
    : p.resource_link || "#";
  return `<a href="${link}" class="showcase-card" target="_blank" rel="noopener" title="${title}">
    <img src="${imgSrc}" alt="" loading="lazy" />
    <span class="showcase-type type-${type}">${type.toUpperCase()}</span>
    <div class="showcase-overlay">
      <span class="showcase-title">${title}</span>
    </div>
  </a>`;
}

function renderShowcaseCarousel(projects) {
  const raw = projects || [];
  const latest = raw.slice(-5).reverse();
  if (!latest.length) return '<div class="showcase-carousel"><div class="showcase-track"></div></div>';
  const slidesHtml = latest
    .map((p) => `<div class="showcase-slide">${getShowcaseCardHtml(p)}</div>`)
    .join("");
  const dotsHtml = latest
    .map((_, i) => `<button type="button" class="showcase-dot ${i === 0 ? "active" : ""}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`)
    .join("");
  return `
  <div class="showcase-carousel">
    <div class="showcase-track">${slidesHtml}</div>
    <div class="showcase-dots">${dotsHtml}</div>
  </div>`;
}

function renderProjects(projects) {
  const list = (projects || []).slice().reverse();
  const showcaseHtml = renderShowcaseCarousel(projects);

  const cardsHtml = list
    .map((p) => {
      const type = p.type || "code";
      const imgSrc = normalizePath(p.image) || "";
      const span2 = p.resource_links && p.resource_links.length > 1;
      const typeIcon = TYPE_ICONS[type] || "fa-folder";
      const links = p.resource_links && p.resource_links.length
        ? p.resource_links
            .filter((l) => l.url)
            .map((l) => `<a href="${l.url}" class="card-link" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> ${l.label || "Open File"}</a>`)
            .join("")
        : p.resource_link
        ? `<a href="${p.resource_link}" class="card-link" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Open File</a>`
        : "";
      const tagsHtml = (p.tags || []).map((t) => `<span class="card-tag">${t}</span>`).join("");

      return `
      <article class="project-card ${span2 ? "span2" : ""}" data-type="${type}">
        <div class="folder-tab type-${type}"><i class="fas ${typeIcon}"></i> ${type.toUpperCase()}</div>
        <div class="classified-watermark">CLASSIFIED</div>
        ${imgSrc ? `<div class="card-image-wrap"><img src="${imgSrc}" alt="" loading="lazy" /></div>` : ""}
        <div class="card-inner">
          <div class="card-type-badge type-${type}"><i class="fas ${typeIcon}"></i> ${type.toUpperCase()}</div>
          <h3 class="card-title">${p.title || "Untitled"}</h3>
          <p class="card-desc">${p.description || ""}</p>
          <div class="card-tags">${tagsHtml}</div>
          <div class="card-links">${links}</div>
        </div>
      </article>
    `;
    })
    .join("");

  return `
    <section id="section-projects" class="content-section">
      <p class="section-label">PROJECTS</p>
      <h2 class="section-title">Projects</h2>
      <p class="showcase-label"><i class="fas fa-star"></i> LATEST OPERATIONS</p>
      ${showcaseHtml}
      <div class="filter-row">
        <button type="button" data-filter="all" class="active"><i class="fas fa-layer-group"></i> All</button>
        <button type="button" data-filter="code"><i class="fas fa-terminal"></i> Code</button>
        <button type="button" data-filter="paper"><i class="fas fa-file-alt"></i> Paper</button>
        <button type="button" data-filter="others"><i class="fas fa-puzzle-piece"></i> Others</button>
      </div>
      <div class="projects-grid">${cardsHtml}</div>
    </section>
  `;
}

function applyProjectFilter(filter) {
  const buttons = $$("#section-projects .filter-row button");
  const sidebarBtns = $$("#sidebarFilters .filter-btn");
  const cards = $$(".project-card");
  buttons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-filter") === filter));
  sidebarBtns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-filter") === filter));
  cards.forEach((card) => {
    const type = card.getAttribute("data-type");
    card.classList.toggle("hidden", filter !== "all" && type !== filter);
  });
  document.getElementById("section-projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initProjectFilters() {
  const filterRow = $("#section-projects .filter-row");
  if (!filterRow) return;
  $$("button", filterRow).forEach((btn) => {
    btn.addEventListener("click", () => applyProjectFilter(btn.getAttribute("data-filter")));
  });
  $$("#sidebarFilters .filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyProjectFilter(btn.getAttribute("data-filter")));
  });
  $$("#sidebarNav a").forEach((a) => {
    a.addEventListener("click", () => $("#sidebar")?.classList.remove("open"));
  });
}

function initShowcaseCarousel() {
  const carousel = $(".showcase-carousel");
  const track = carousel?.querySelector(".showcase-track");
  const dots = carousel ? $$(".showcase-dot", carousel) : [];
  const slides = track ? track.querySelectorAll(".showcase-slide") : [];
  const N = slides.length;
  if (!track || N === 0) return;
  let currentIndex = 0;
  let autoTimer = null;

  function goTo(index) {
    currentIndex = (index + N) % N;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(currentIndex + 1), 4000);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  dots.forEach((d) =>
    d.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(parseInt(d.getAttribute("data-index") || "0", 10));
      startAuto();
    })
  );

  startAuto();
}

// ---------- Certificates & Badges ----------
function renderCertificates(certificates, credlyBadges) {
  const certs = certificates || [];
  const certCards = certs
    .map((c) => {
      const file = c.file || "";
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
      const imgSrc = isImage ? normalizePath(file) : "";
      const imgHtml = imgSrc
        ? `<img src="${imgSrc}" alt="${(c.name || "").slice(0, 50)}" loading="lazy" />`
        : `<div style="height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:2rem;"><i class="fas fa-file-pdf"></i></div>`;
      const viewLink = file ? `<span class="cert-link"><i class="fas fa-eye"></i> View</span>` : "";
      const inner = `
        <div class="cert-image-wrap">${imgHtml}</div>
        <div class="cert-body">
          <h4 class="cert-name">${c.name || "Certificate"}</h4>
          <p class="cert-issuer">${c.issuer || ""}</p>
          <span class="cert-year">${c.year || ""}</span>
          ${viewLink}
        </div>
      `;
      if (file) {
        return `<a href="${normalizePath(file)}" class="cert-card cert-card-link" target="_blank" rel="noopener">${inner}</a>`;
      }
      return `<div class="cert-card">${inner}</div>`;
    })
    .join("");

  const badges = credlyBadges || [];
  const singleSet = badges
    .map((path) => `
    <div class="badge-tile">
      <img src="${path}" alt="" loading="lazy" />
      <span class="badge-name">${credlyBadgeName(path)}</span>
    </div>`)
    .join("");
  const marqueeTrack = singleSet + singleSet;

  return `
    <section id="section-certificates" class="content-section">
      <p class="section-label">CERTIFICATIONS & BADGES</p>
      <h2 class="section-title">Credentials</h2>
      <div class="certs-grid">${certCards}</div>
      <p class="badges-section-label">CREDLY BADGES</p>
      <div class="badges-marquee">
        <div class="badges-track">${marqueeTrack}</div>
      </div>
    </section>
  `;
}

// ---------- Education / Timeline ----------
function renderEducation(education) {
  const edu = education || [];

  const entriesHtml = edu
    .map((e, i) => {
      const side = i % 2 === 0 ? "left" : "right";
      return `
      <div class="timeline-item timeline-${side}" style="--i:${i}">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <span class="timeline-date"><i class="fas fa-calendar-alt"></i> ${e.date_graduated || ""}</span>
          <div class="timeline-card-header">
            <img src="${normalizePath(e.school_logo_url)}" alt="" class="edu-logo" />
            <div>
              <h4 class="edu-school">${e.school || ""}</h4>
              <span class="edu-level">${(e.education || "").replace("_", " ")}</span>
            </div>
          </div>
          <p class="edu-course">${e.course_strand || ""}</p>
          <p class="edu-meta"><i class="fas fa-map-marker-alt"></i> ${e.location || ""}</p>
        </div>
      </div>`;
    })
    .join("");

  return `
    <section id="section-education" class="content-section">
      <p class="section-label">TIMELINE</p>
      <h2 class="section-title">Education</h2>
      <div class="timeline-container">
        <div class="timeline-line"></div>
        ${entriesHtml}
      </div>
    </section>
  `;
}

// ---------- Operations Log ----------
function renderOperationsLog(exposure) {
  const exp = exposure || [];
  if (!exp.length) return "";

  const opsHtml = exp
    .map((x) => `
    <div class="ops-entry">
      <h4 class="ops-role"><i class="fas fa-crosshairs"></i> ${x.title || ""}</h4>
      <p class="ops-org">${x.org || ""}</p>
      <p class="ops-period">${x.period || ""}</p>
      <ul>${(x.highlights || []).map((h) => `<li>${h}</li>`).join("")}</ul>
    </div>
  `)
    .join("");

  return `
    <section id="section-operations" class="content-section">
      <p class="section-label">OPERATIONS</p>
      <h2 class="section-title">Operations Log</h2>
      ${opsHtml}
    </section>
  `;
}

function initTimeline() {
  const items = $$(".timeline-item");
  if (!items.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          observer.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -50px 0px", threshold: 0.15 }
  );
  items.forEach((item) => observer.observe(item));
}

// ---------- Contact ----------
function renderContact(contact, profile) {
  const c = contact || {};
  const socials = profile?.socials || [];
  const primaryEmail = "arvyaggabao.7@gmail.com";
  const backupEmail = "aggabaoarvy072004@gmail.com";
  const location = c.location || "—";

  const socialRows = socials
    .map((s) =>
      `<div class="contact-row"><span class="key"><i class="fab fa-${s.platform}"></i> ${(s.platform || "").toUpperCase()}</span> <a href="${s.url}" target="_blank" rel="noopener">${s.url}</a></div>`
    )
    .join("");

  return `
    <section id="section-contact" class="content-section">
      <div>
        <p class="section-label">CONTACT</p>
        <h2 class="section-title">Secure Channel</h2>
        <p class="contact-blurb">For operational or collaboration inquiries, use the channels below.</p>
        <div class="contact-rows">
          <div class="contact-row"><span class="key"><i class="fas fa-envelope"></i> EMAIL</span> <a href="mailto:${primaryEmail}">${primaryEmail}</a></div>
          <div class="contact-row"><span class="key"><i class="fas fa-envelope-open"></i> BACKUP</span> <a href="mailto:${backupEmail}">${backupEmail}</a></div>
          <div class="contact-row"><span class="key"><i class="fas fa-map-marker-alt"></i> LOCATION</span> ${location}</div>
        </div>
        <div class="social-rows contact-rows">${socialRows}</div>
      </div>
      <div class="terminal-block">
        <div class="term-line"><span class="term-prompt">$</span> whoami</div>
        <div class="term-line">${profile?.name || "subject"}</div>
        <div class="term-line"><span class="term-prompt">$</span> status --clearance</div>
        <div class="term-line"><span class="term-redacted">LEVEL_4_ACTIVE</span></div>
        <div class="term-line"><span class="term-prompt">$</span> <span class="term-cursor"></span></div>
      </div>
    </section>
  `;
}

// ---------- Footer ----------
function renderFooter(profile) {
  const text = profile?.footerText || "© All rights reserved.";
  return `
    <p class="footer-text">${text}</p>
    <span class="footer-easter" title="Easter egg">FLAG{cl4ss1f13d_d0551er_v4}</span>
    <span class="footer-easter" title="Easter egg">REDACTED</span>
  `;
}

// ---------- Main: fetch, render, boot ----------
async function bootstrap() {
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    const data = await res.json();

    renderSidebar(data);
    renderStatusBar(data);

    const content = $("#content");
    const footer = $("#footer");

    content.innerHTML =
      renderHero(data.profile) +
      renderStats(data) +
      renderAbout(data.about, data.profile, data.contact) +
      renderEducation(data.education) +
      renderSkills(data.skills) +
      renderProjects(data.projects) +
      renderOperationsLog(data.exposure) +
      renderCertificates(data.certificates, data.credly_badges) +
      renderContact(data.contact, data.profile);

    footer.innerHTML = renderFooter(data.profile);

    initProjectFilters();
    initShowcaseCarousel();
    initTimeline();
    initScrollSpy();
    initObservers();
    initClearanceBar();
    initSidebarToggle();
    initDarkLightToggle();
    initBackToTop();

    triggerBootSequence(data);

    setTimeout(() => {
      initTypewriter(data.profile?.titleKeywords || []);
      initCanvas();
      initCursor();
    }, 4000);
  } catch (e) {
    console.error("Failed to load dossier data", e);
    $("#boot").classList.add("done");
    $("#app").style.opacity = "1";
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
