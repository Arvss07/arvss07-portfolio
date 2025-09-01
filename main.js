// Utilities
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Loading overlay fade-out
window.addEventListener("load", () => {
  const loader = $("#loadingOverlay");
  loader?.classList.add("fade-out");
  setTimeout(() => loader && (loader.style.display = "none"), 500);
});

// Header shrink on scroll (custom header)
window.addEventListener("scroll", () => {
  const header = $("#mainHeader");
  header?.classList.toggle("header-scrolled", window.scrollY > 50);
});

// Simple scrollspy for active nav highlighting
function setupScrollSpy() {
  const links = Array.from(document.querySelectorAll("#appNav .nav-link"));
  const targets = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((a) => {
      const match = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", match);
    });
    positionActivePill();
  };

  const onScroll = () => {
    const offset = 120; // account for navbar height
    let currentId = null;
    for (const sec of targets) {
      const rect = sec.getBoundingClientRect();
      if (rect.top - offset <= 0 && rect.bottom > offset) {
        currentId = sec.id;
      }
    }
    if (currentId) setActive(currentId);
  };

  window.addEventListener("scroll", onScroll);
  onScroll();
}

// Animate in view with IntersectionObserver
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
      } else {
        e.target.classList.remove("in-view");
      }
    });
  },
  { threshold: 0.2 }
);

function observeAll(container) {
  container?.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}

// Render helpers
// Optional icon map for project tags
const TAG_ICON_MAP = {
  html: { provider: "devicon", id: "html5" },
  css: { provider: "devicon", id: "css3" },
  javascript: { provider: "devicon", id: "javascript" },
  typescript: { provider: "devicon", id: "typescript" },
  python: { provider: "devicon", id: "python" },
  flask: { provider: "simple-icons", id: "flask" },
  node: { provider: "devicon", id: "nodejs" },
  "node.js": { provider: "devicon", id: "nodejs" },
  socketio: { provider: "simple-icons", id: "socketdotio" },
  "socket.io": { provider: "simple-icons", id: "socketdotio" },
  react: { provider: "devicon", id: "react" },
  bootstrap: { provider: "devicon", id: "bootstrap" },
  aos: { provider: "simple-icons", id: "aos" },
  git: { provider: "devicon", id: "git" },
};

function renderSocials(socials) {
  return socials
    .map(
      (s) =>
        `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.platform}"><i class="fab fa-${s.platform}"></i></a>`
    )
    .join("");
}

function renderAbout(about) {
  $("#aboutIntro").textContent = about.intro;
  const wrap = $("#aboutFeatures");
  wrap.innerHTML = about.features
    .map(
      (f) => `
      <div class="col-md-4" data-reveal>
        <div class="feature-card" data-aos="zoom-in">
          <i class="fas ${f.icon}"></i>
          <h3>${f.title}</h3>
          <p>${f.text}</p>
        </div>
      </div>`
    )
    .join("");
  observeAll(wrap);
}

function skillIconHTML(item) {
  const isObj = typeof item === "object" && item !== null;
  const label = isObj ? item.label : String(item);
  const provider = (isObj ? item.provider : "devicon") || "devicon";
  const id = (isObj ? item.id : label) || "";
  const normId = String(id)
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/\s+/g, "");

  if (provider === "skillicons") {
    return `<img class="skill-icon" src="https://skillicons.dev/icons?i=${encodeURIComponent(
      normId
    )}" alt="${label}" loading="lazy"/>`;
  }
  if (provider === "simple-icons") {
    return `<img class="skill-icon" src="https://cdn.simpleicons.org/${encodeURIComponent(
      normId
    )}" alt="${label}" loading="lazy"/>`;
  }
  // devicon as default
  const className =
    isObj && item.className
      ? item.className
      : `devicon-${normId}-plain colored`;
  return `<i class="${className}" title="${label}"></i>`;
}

function renderSkills(skills) {
  const grid = $("#skillsGrid");
  grid.innerHTML = skills
    .map((cat) => {
      const items = (cat.items || [])
        .map(
          (s) => `
            <div class="skill-chip" title="${
              typeof s === "object" ? s.label : s
            }">
              ${skillIconHTML(s)}
              <span>${typeof s === "object" ? s.label : s}</span>
            </div>`
        )
        .join("");
      return `
      <div class="col-lg-4" data-reveal>
        <div class="skill-category" data-aos="fade-up">
          <h3><i class="fas ${cat.icon}"></i> ${cat.name}</h3>
          <div class="skills-wrap">${items}</div>
        </div>
      </div>`;
    })
    .join("");
  observeAll(grid);
}
function renderProjects(projects) {
  const grid = $("#projectsGrid");
  grid.innerHTML = projects
    .map((p, idx) => {
      const tags = (p.tags || []).map((t) => {
        const key = String(t).toLowerCase();
        const meta = TAG_ICON_MAP[key] || null;
        const html = meta
          ? skillIconHTML({ provider: meta.provider, id: meta.id, label: t })
          : "";
        return `<span class="project-tag">${html}<span>${t}</span></span>`;
      });

      return `
      <div class="col-lg-4 col-md-6" data-reveal>
        <div class="project-card" data-aos="fade-up" data-project>
          <div class="project-head" role="button" aria-expanded="false" tabindex="0">
            <img src="${p.image}" alt="${p.title}" />
            <div class="project-title text-truncate">${p.title}</div>
            <button class="project-toggle" aria-label="Toggle details" aria-expanded="false">
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
          <div class="project-body" id="proj-body-${idx}">
            <p class="project-desc">${p.description || ""}</p>
            <div class="project-tags">${tags.join(" ")}</div>
            <div class="project-actions">
              ${
                p.link
                  ? `<a class="btn btn-sm btn-primary" href="${p.link}" target="_blank" rel="noopener">Open</a>`
                  : ""
              }
              ${
                p.repo
                  ? `<a class="btn btn-sm btn-outline-primary" href="${p.repo}" target="_blank" rel="noopener">Source</a>`
                  : ""
              }
            </div>
          </div>
        </div>
      </div>`;
    })
    .join("");
  observeAll(grid);
  setupProjectCardToggles();
}

function renderExposure(items) {
  const grid = document.getElementById("exposureGrid");
  grid.innerHTML = (items || [])
    .map(
      (x) => `
      <div class="col-lg-6" data-reveal>
        <div class="exposure-card" data-aos="fade-up">
          <h4 class="mb-1">${x.title}</h4>
          <div class="fw-lighter small mb-2">${x.org} • ${x.period}</div>
          <ul class="mb-0">
            ${(x.highlights || []).map((h) => `<li>${h}</li>`).join("")}
          </ul>
        </div>
      </div>`
    )
    .join("");
  observeAll(grid);
}

function renderCertificates(certs) {
  const grid = $("#certificatesGrid");
  grid.innerHTML = certs
    .map(
      (c) => `
      <div class="col-lg-4 col-md-6" data-reveal>
        <div class="certificate-card" data-aos="zoom-in">
          <div class="certificate-icon"><i class="fas fa-award"></i></div>
          <h5>${c.name}</h5>
          <p class="mb-1">${c.issuer}</p>
          <span class="badge bg-primary-subtle text-primary">${c.year}</span>
          <div class="mt-3">
            <a class="btn btn-sm btn-outline-primary" href="${c.file}" target="_blank" rel="noopener">View</a>
          </div>
        </div>
      </div>`
    )
    .join("");
  observeAll(grid);
}

function renderContact(contact) {
  const section = document.getElementById("contact");
  if (!section) {
    const footer = document.querySelector("footer");
    const s = document.createElement("section");
    s.id = "contact";
    s.innerHTML = `
      <div class="container">
        <h2 class="section-title">Contact</h2>
        <div class="row g-4 justify-content-center">
          <div class="col-lg-6">
            <div class="contact-card">
              <p><i class="fas fa-envelope"></i> <a href="mailto:${contact.email}">${contact.email}</a></p>
              <p><i class="fas fa-phone"></i> <a href="tel:${contact.phone}">${contact.phone}</a></p>
              <p><i class="fas fa-location-dot"></i> ${contact.location}</p>
            </div>
          </div>
        </div>
      </div>`;
    footer.parentNode.insertBefore(s, footer);
  }
}

async function bootstrap() {
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    const data = await res.json();

    // Profile and hero
    if (data.profile?.name) {
      document.title = `${data.profile.name} - IT Undergraduate Portfolio`;
    }
    $("#brandName").textContent = data.profile.brand || data.profile.name;
    $("#heroName").textContent = data.profile.name;
    $("#heroImage").src = data.profile.photo;
    const resume = $("#resumeLink");
    resume.href = data.profile.resume || "#";
    $("#footerText").textContent = data.profile.footerText || "";

    // Typed.js with data keywords
    if (
      Array.isArray(data.profile.titleKeywords) &&
      data.profile.titleKeywords.length
    ) {
      new Typed("#typed-text", {
        strings: data.profile.titleKeywords,
        typeSpeed: 60,
        backSpeed: 40,
        loop: true,
      });
    }

    // Sections
    renderAbout(data.about);
    renderSkills(data.skills || []);
    renderProjects(data.projects || []);
    // Exposure replaces Experience
    renderExposure(data.exposure || data.experience || []);
    renderCertificates(data.certificates || []);
    renderContact(data.contact || {});

    // AOS init after content
    AOS.init({ duration: 800, once: true });

    // Force dark mode tokens (palette is dark-first)
    document.documentElement.classList.add("dark");

    // Init scrollspy and header interactions after DOM is ready
    setupScrollSpy();
    initHeaderInteractions();
  } catch (e) {
    console.error("Failed to load data.json", e);
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);

// Expansion toggles for project cards
function setupProjectCardToggles() {
  $$(".project-card").forEach((card) => {
    const head = card.querySelector(".project-head");
    const body = card.querySelector(".project-body");
    const toggleBtn = card.querySelector(".project-toggle");

    const setMax = (open) => {
      if (open) {
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        body.style.maxHeight = 0;
      }
    };

    const toggle = () => {
      const expanded = card.classList.toggle("expanded");
      toggleBtn.setAttribute("aria-expanded", String(expanded));
      head.setAttribute("aria-expanded", String(expanded));
      setMax(expanded);
    };

    // Initialize collapsed
    setMax(false);

    head.addEventListener("click", toggle);
    head.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle();
    });

    // Adjust maxHeight on resize for smoothness
    window.addEventListener("resize", () => {
      if (card.classList.contains("expanded")) {
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });
}

// Custom header interactions (hamburger + active pill)
function initHeaderInteractions() {
  const header = document.getElementById("mainHeader");
  const nav = document.getElementById("appNav");
  const toggle = document.getElementById("navToggle");
  if (!header || !nav || !toggle) return;

  const close = () => {
    header.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    header.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  };
  const toggleMenu = () => {
    header.classList.contains("open") ? close() : open();
  };

  toggle.addEventListener("click", toggleMenu);
  nav.querySelectorAll(".nav-link").forEach((a) => {
    a.addEventListener("click", () => {
      close();
    });
  });

  window.addEventListener("resize", positionActivePill);
  positionActivePill();
}

function positionActivePill() {
  const nav = document.getElementById("appNav");
  if (!nav) return;
  const pill = nav.querySelector(".active-pill");
  const active =
    nav.querySelector(".nav-link.active") || nav.querySelector(".nav-link");
  if (!pill || !active) return;
  const navRect = nav.getBoundingClientRect();
  const aRect = active.getBoundingClientRect();
  const left = aRect.left - navRect.left;
  const width = aRect.width;
  pill.style.opacity = "1";
  pill.style.transform = `translateX(${left}px)`;
  pill.style.width = `${Math.max(34, width)}px`;
}
