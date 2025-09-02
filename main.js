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
      <div class="col-lg-4 col-md-6 col-sm-12" data-reveal>
        <div class="feature-card" data-aos="zoom-in">
          <div class="feature-icon-wrapper">
            <i class="fas ${f.icon}"></i>
          </div>
          <div class="feature-content">
            <h3>${f.title}</h3>
            <p>${f.text}</p>
          </div>
        </div>
      </div>`
    )
    .join("");
  observeAll(wrap);
}

function renderEducation(education) {
  const grid = $("#educationGrid");
  if (!grid) return;

  grid.innerHTML = education
    .map(
      (edu) => `
      <div class="col-lg-4 col-md-6" data-reveal>
        <div class="education-card" data-aos="fade-up">
          <div class="education-header">
            <div class="education-logo-wrapper">
              <img src="${edu.school_logo_url}" alt="${
        edu.school
      } Logo" class="education-logo" />
            </div>
            <div class="education-level">
              ${
                edu.education === "college"
                  ? "College"
                  : edu.education === "senior_high"
                  ? "Senior High"
                  : "Junior High"
              }
            </div>
          </div>
          <div class="education-body">
            <h4 class="education-school">${edu.school}</h4>
            <p class="education-location">
              <i class="fas fa-map-marker-alt"></i>
              ${edu.location}
            </p>
            <p class="education-course">${edu.course_strand}</p>
            <div class="education-date">
              <i class="fas fa-calendar-alt"></i>
              ${edu.date_graduated}
            </div>
          </div>
        </div>
      </div>`
    )
    .join("");
  observeAll(grid);
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

  // Reverse the projects array so the last item appears first
  const reversedProjects = [...projects].reverse();

  grid.innerHTML = reversedProjects
    .map((p, idx) => {
      const tags = (p.tags || []).map((t) => {
        const key = String(t).toLowerCase();
        const meta = TAG_ICON_MAP[key] || null;
        const html = meta
          ? skillIconHTML({ provider: meta.provider, id: meta.id, label: t })
          : "";
        return `<span class="project-tag">${html}<span>${t}</span></span>`;
      });

      // Determine resource button based on type and resource_link
      let resourceButton = "";
      if (p.resource_link && p.resource_link !== "#") {
        if (p.type === "code") {
          resourceButton = `
            <a class="resource-btn github-btn" href="${p.resource_link}" target="_blank" rel="noopener">
              <i class="fab fa-github"></i>
              <span>View Code</span>
            </a>
          `;
        } else if (p.type === "paper" || p.type === "others") {
          resourceButton = `
            <a class="resource-btn pdf-btn" href="${p.resource_link}" target="_blank" rel="noopener">
              <i class="fas fa-file-pdf"></i>
              <span>View Document</span>
            </a>
          `;
        }
      }

      return `
      <div class="col-lg-4 col-md-6 project-item" data-reveal data-type="${
        p.type
      }">
        <div class="project-card" data-aos="fade-up" data-project>
          <div class="project-head" role="button" aria-expanded="false" tabindex="0">
            <img src="${p.image}" alt="${p.title}" />
            <div class="project-title">${p.title}</div>
            <button class="project-toggle" aria-label="Toggle details" aria-expanded="false">
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
          <div class="project-body" id="proj-body-${idx}">
            <p class="project-desc">${p.description || ""}</p>
            <div class="project-tags">${tags.join(" ")}</div>
            <div class="project-actions">
              ${resourceButton}
            </div>
          </div>
        </div>
      </div>`;
    })
    .join("");

  observeAll(grid);
  setupProjectCardToggles();
  setupProjectFilters();
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
          <ul class="mb-3">
            ${(x.highlights || []).map((h) => `<li>${h}</li>`).join("")}
          </ul>
          ${
            x.file
              ? `
          <div class="mt-3">
            <button class="btn btn-sm btn-outline-primary exposure-btn" 
                    data-file="${x.file}" 
                    data-name="${x.title}">
              <i class="fas fa-eye me-1"></i>View Attachment
            </button>
          </div>
          `
              : ""
          }
        </div>
      </div>`
    )
    .join("");
  observeAll(grid);

  // Add event listeners for exposure buttons
  $$(".exposure-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filePath = this.getAttribute("data-file");
      const exposureName = this.getAttribute("data-name");
      showCertificateModal(filePath, exposureName);
    });
  });
}

function renderCertificates(certs) {
  const grid = $("#certificatesGrid");
  if (!grid) {
    console.error("Certificate grid element not found");
    return;
  }

  if (!certs || certs.length === 0) {
    grid.innerHTML =
      '<div class="col-12 text-center"><p class="text-muted">No certificates available</p></div>';
    return;
  }

  grid.innerHTML = certs
    .map(
      (c, idx) => `
      <div class="col-lg-4 col-md-6" data-reveal>
        <div class="certificate-card" data-aos="zoom-in">
          <div class="certificate-icon"><i class="fas fa-award"></i></div>
          <h5>${c.name || "Certificate"}</h5>
          <p class="mb-1">${c.issuer || "Unknown Issuer"}</p>
          <span class="badge bg-primary-subtle text-primary">${
            c.year || "N/A"
          }</span>
          <div class="mt-3">
            <button class="btn btn-sm btn-outline-primary certificate-btn" 
                    data-file="${c.file}" 
                    data-name="${c.name || "Certificate"}">
              <i class="fas fa-eye me-1"></i>View Certificate
            </button>
          </div>
        </div>
      </div>`
    )
    .join("");

  observeAll(grid);

  // Add event listeners for certificate buttons
  $$(".certificate-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filePath = this.getAttribute("data-file");
      const certificateName = this.getAttribute("data-name");
      showCertificateModal(filePath, certificateName);
    });
  });

  // Add modal to the page if it doesn't exist
  if (!document.getElementById("certificateModal")) {
    const modalHTML = `
      <div class="modal fade" id="certificateModal" tabindex="-1" aria-labelledby="certificateModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content" style="background: var(--white-bg); border: 1px solid var(--border-color);">
            <div class="modal-header" style="border-bottom: 1px solid var(--border-color);">
              <h5 class="modal-title text-white" id="certificateModalLabel">Certificate</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
              <div id="certificateContent">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }
}

// Function to show certificate in modal
function showCertificateModal(filePath, certificateName) {
  const modalElement = document.getElementById("certificateModal");
  const modalTitle = document.getElementById("certificateModalLabel");
  const certificateContent = document.getElementById("certificateContent");

  if (!modalElement || !modalTitle || !certificateContent) {
    console.error("Modal elements not found");
    return;
  }

  // Show modal manually without Bootstrap JS
  modalTitle.textContent = certificateName || "Certificate";

  // Show loading spinner
  certificateContent.innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;

  // Show modal manually
  modalElement.style.display = "block";
  modalElement.classList.add("show");
  modalElement.setAttribute("aria-modal", "true");
  modalElement.setAttribute("role", "dialog");
  modalElement.removeAttribute("aria-hidden");
  document.body.classList.add("modal-open");

  // Add backdrop if it doesn't exist
  let backdrop = document.querySelector(".modal-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop fade show";
    document.body.appendChild(backdrop);
  }

  // Close modal function
  const closeModal = () => {
    modalElement.style.display = "none";
    modalElement.classList.remove("show");
    modalElement.setAttribute("aria-hidden", "true");
    modalElement.removeAttribute("aria-modal");
    modalElement.removeAttribute("role");
    document.body.classList.remove("modal-open");
    if (backdrop) {
      backdrop.remove();
    }
  };

  // Add close functionality
  const closeButtons = modalElement.querySelectorAll(
    '[data-bs-dismiss="modal"]'
  );
  closeButtons.forEach((btn) => {
    btn.onclick = closeModal;
  });

  // Close on backdrop click
  backdrop.onclick = closeModal;

  // Close on Escape key
  const escapeHandler = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);

  // Small delay to ensure modal is visible before loading content
  setTimeout(() => {
    if (!filePath) {
      certificateContent.innerHTML = `
        <div class="alert alert-warning" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Certificate file not available
        </div>
      `;
      return;
    }

    // Check if file is a PDF or image
    if (filePath.toLowerCase().endsWith(".pdf")) {
      certificateContent.innerHTML = `
        <div class="pdf-container">
          <embed src="${filePath}" type="application/pdf" width="100%" height="500px" style="border-radius: 8px; border: 1px solid var(--border-color);" />
          <div class="mt-3">
            <a href="${filePath}" target="_blank" class="btn btn-primary btn-sm">
              <i class="fas fa-external-link-alt me-1"></i>Open in New Tab
            </a>
          </div>
        </div>
      `;
    } else {
      // Assume it's an image
      certificateContent.innerHTML = `
        <div class="image-container">
          <img src="${filePath}" 
               alt="${certificateName}" 
               class="img-fluid" 
               style="max-height: 500px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"
               onload="this.style.opacity=1" 
               onerror="this.parentElement.innerHTML='<div class=\\'alert alert-danger\\' role=\\'alert\\'>Failed to load certificate image</div>'"
               style="opacity: 0; transition: opacity 0.3s ease;" />
        </div>
      `;
    }
  }, 100);
}

function renderContact(contact, socials) {
  const section = document.getElementById("contact");
  if (!section) {
    const footer = document.querySelector("footer");
    const s = document.createElement("section");
    s.id = "contact";
    s.innerHTML = `
      <div class="container">
        <h2 class="section-title">Let's Connect</h2>
        <div class="row g-4 justify-content-center">
          <div class="col-lg-8">
            <div class="contact-info-card" data-aos="fade-up">
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="contact-item">
                    <div class="contact-icon">
                      <i class="fas fa-envelope"></i>
                    </div>
                    <div class="contact-details">
                      <h5>Primary Email</h5>
                      <a href="mailto:${contact.email}">${contact.email}</a>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="contact-item">
                    <div class="contact-icon">
                      <i class="fas fa-envelope-open"></i>
                    </div>
                    <div class="contact-details">
                      <h5>Backup Email</h5>
                      <a href="mailto:${contact.backup_email}">${
      contact.backup_email
    }</a>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="contact-item">
                    <div class="contact-icon">
                      <i class="fas fa-location-dot"></i>
                    </div>
                    <div class="contact-details">
                      <h5>Location</h5>
                      <p>${contact.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Social Media Links -->
              <div class="social-connect mt-4">
                <h5 class="text-center mb-3">Follow Me</h5>
                <div class="social-links d-flex justify-content-center gap-3">
                  ${socials
                    .map(
                      (social) => `
                    <a href="${
                      social.url
                    }" target="_blank" rel="noopener" class="social-btn ${
                        social.platform
                      }-btn" aria-label="${social.platform}">
                      <i class="fab fa-${social.platform}"></i>
                      <span>${
                        social.platform.charAt(0).toUpperCase() +
                        social.platform.slice(1)
                      }</span>
                    </a>
                  `
                    )
                    .join("")}
                </div>
              </div>
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
      const firstName = data.profile.name.split(" ")[0];
      document.title = `${firstName} - Portfolio`;
    }
    $("#brandName").textContent = data.profile.brand || data.profile.name;
    $("#heroName").textContent = data.profile.name;
    $("#heroImage").src = data.profile.photo;
    $("#footerText").textContent = data.profile.footerText || "";

    // Set GitHub button URL
    const githubBtn = $("#githubBtn");
    const githubSocial = data.profile.socials?.find(
      (s) => s.platform === "github"
    );
    if (githubBtn && githubSocial) {
      githubBtn.href = githubSocial.url;
    }

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
    renderEducation(data.education || []);
    renderSkills(data.skills || []);
    renderProjects(data.projects || []);
    // Exposure replaces Experience
    renderExposure(data.exposure || data.experience || []);
    renderCertificates(data.certificates || []);
    renderContact(data.contact || {}, data.profile.socials || []);

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
  let expandedCard = null;

  $$(".project-card").forEach((card) => {
    const head = card.querySelector(".project-head");
    const body = card.querySelector(".project-body");
    const toggleBtn = card.querySelector(".project-toggle");

    const setMax = (open) => {
      if (open) {
        // Reset max-height to measure actual content height
        body.style.maxHeight = "none";
        body.style.padding = "1.2rem 1.4rem 1.4rem";
        body.style.opacity = "1";

        // Get the actual content height including padding
        const height = body.scrollHeight;

        // Reset to collapsed state for animation
        body.style.maxHeight = "0";
        body.style.padding = "0 1.4rem";
        body.style.opacity = "0";

        // Force reflow and animate to full height with some extra space
        requestAnimationFrame(() => {
          body.style.maxHeight = height + 40 + "px";
          body.style.padding = "1.2rem 1.4rem 1.4rem";
          body.style.opacity = "1";
        });
      } else {
        // Get current height for smooth collapse
        const currentHeight = body.scrollHeight;
        body.style.maxHeight = currentHeight + "px";

        // Force reflow then collapse
        requestAnimationFrame(() => {
          body.style.maxHeight = "0";
          body.style.padding = "0 1.4rem";
          body.style.opacity = "0";
        });
      }
    };

    const closeCard = () => {
      card.classList.remove("expanded");
      toggleBtn.setAttribute("aria-expanded", "false");
      head.setAttribute("aria-expanded", "false");
      setMax(false);
      if (expandedCard === card) {
        expandedCard = null;
      }
    };

    const openCard = () => {
      // Close previously expanded card
      if (expandedCard && expandedCard !== card) {
        const prevBody = expandedCard.querySelector(".project-body");
        const prevToggleBtn = expandedCard.querySelector(".project-toggle");
        const prevHead = expandedCard.querySelector(".project-head");

        expandedCard.classList.remove("expanded");
        prevToggleBtn.setAttribute("aria-expanded", "false");
        prevHead.setAttribute("aria-expanded", "false");

        // Smooth collapse of previous card
        const currentHeight = prevBody.scrollHeight;
        prevBody.style.maxHeight = currentHeight + "px";
        requestAnimationFrame(() => {
          prevBody.style.maxHeight = "0";
          prevBody.style.padding = "0 1.4rem";
          prevBody.style.opacity = "0";
        });
      }

      card.classList.add("expanded");
      toggleBtn.setAttribute("aria-expanded", "true");
      head.setAttribute("aria-expanded", "true");
      setMax(true);
      expandedCard = card;
    };

    const toggle = () => {
      const isExpanded = card.classList.contains("expanded");
      if (isExpanded) {
        closeCard();
      } else {
        openCard();
      }
    };

    // Initialize collapsed
    body.style.maxHeight = "0";

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
    const resizeHandler = () => {
      if (card.classList.contains("expanded")) {
        body.style.maxHeight = "none";
        body.style.padding = "1.2rem 1.4rem 1.4rem";
        body.style.opacity = "1";
        const height = body.scrollHeight;
        body.style.maxHeight = height + 40 + "px";
      }
    };

    window.addEventListener("resize", resizeHandler);

    // Store the resize handler reference for cleanup if needed
    card._resizeHandler = resizeHandler;
  });

  // Close expanded card when clicking outside
  const outsideClickHandler = (e) => {
    if (expandedCard && !expandedCard.contains(e.target)) {
      const body = expandedCard.querySelector(".project-body");
      const toggleBtn = expandedCard.querySelector(".project-toggle");
      const head = expandedCard.querySelector(".project-head");

      expandedCard.classList.remove("expanded");
      toggleBtn.setAttribute("aria-expanded", "false");
      head.setAttribute("aria-expanded", "false");

      const currentHeight = body.scrollHeight;
      body.style.maxHeight = currentHeight + "px";
      requestAnimationFrame(() => {
        body.style.maxHeight = "0";
        body.style.padding = "0 1.4rem";
        body.style.opacity = "0";
      });
      expandedCard = null;
    }
  };

  document.addEventListener("click", outsideClickHandler);
}

// Project filtering functionality
function setupProjectFilters() {
  const tabButtons = $$(".tab-btn");
  const projectItems = $$(".project-item");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // Update active tab
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Close any expanded project cards first
      const expandedCards = $$(".project-card.expanded");
      expandedCards.forEach((card) => {
        const body = card.querySelector(".project-body");
        const toggleBtn = card.querySelector(".project-toggle");
        const head = card.querySelector(".project-head");

        card.classList.remove("expanded");
        toggleBtn.setAttribute("aria-expanded", "false");
        head.setAttribute("aria-expanded", "false");

        const currentHeight = body.scrollHeight;
        body.style.maxHeight = currentHeight + "px";
        requestAnimationFrame(() => {
          body.style.maxHeight = "0";
          body.style.padding = "0 1.4rem";
          body.style.opacity = "0";
        });
      });

      // Filter projects with smoother animation
      projectItems.forEach((item, index) => {
        const projectType = item.getAttribute("data-type");
        const shouldShow = filter === "all" || projectType === filter;
        const card = item.querySelector(".project-card");

        if (shouldShow) {
          // Show items with staggered delay
          item.style.display = "block";
          item.classList.remove("hiding");

          setTimeout(() => {
            card.classList.remove("filtered-out");
            card.classList.add("filtered-in");
          }, index * 50); // Staggered appearance
        } else {
          // Hide items immediately but with animation
          card.classList.remove("filtered-in");
          card.classList.add("filtered-out");
          item.classList.add("hiding");

          // Actually hide after animation completes
          setTimeout(() => {
            if (card.classList.contains("filtered-out")) {
              item.style.display = "none";
            }
          }, 400);
        }
      });
    });
  });

  // Initialize all projects as visible
  projectItems.forEach((item) => {
    const card = item.querySelector(".project-card");
    card.classList.add("filtered-in");
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
