// Utilities
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Loading overlay fade-out
window.addEventListener("load", () => {
  const loader = $("#loadingOverlay");
  loader?.classList.add("fade-out");
  setTimeout(() => loader && (loader.style.display = "none"), 500);
});

// Navbar shrink on scroll
window.addEventListener("scroll", () => {
  const navbar = $("#mainNavbar");
  navbar?.classList.toggle("navbar-scrolled", window.scrollY > 50);
});

// Animate in view with IntersectionObserver
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("in-view");
    });
  },
  { threshold: 0.15 }
);

function observeAll(container) {
  container?.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}

// Render helpers
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
    .map(
      (p) => `
      <div class="col-lg-4 col-md-6" data-reveal>
        <a class="project-card d-block text-decoration-none" href="${
          p.link || "#"
        }" target="_blank" rel="noopener" data-aos="fade-up">
          <img src="${p.image}" alt="${p.title}" />
          <div class="card-body">
            <h5 class="card-title">${p.title}</h5>
            <p class="card-text">${p.description}</p>
            ${p.tags
              .map((t) => `<span class="project-badge">${t}</span>`)
              .join(" ")}
          </div>
        </a>
      </div>`
    )
    .join("");
  observeAll(grid);
}

function renderExperience(exp) {
  const tl = $("#experienceTimeline");
  tl.innerHTML = exp
    .map(
      (e) => `
      <div class="timeline-item" data-reveal data-aos="fade-left">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h4>${e.role} • <span class="text-primary">${e.company}</span></h4>
          <span class="text-muted small">${e.period}</span>
          <ul>
            ${e.bullets.map((b) => `<li>${b}</li>`).join("")}
          </ul>
        </div>
      </div>`
    )
    .join("");
  observeAll(tl);
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
    $("#heroSocials").innerHTML = renderSocials(data.profile.socials || []);
    $("#footerSocials").innerHTML = renderSocials(data.profile.socials || []);
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
    renderExperience(data.experience || []);
    renderCertificates(data.certificates || []);
    renderContact(data.contact || {});

    // AOS init after content
    AOS.init({ duration: 800, once: true });
  } catch (e) {
    console.error("Failed to load data.json", e);
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
