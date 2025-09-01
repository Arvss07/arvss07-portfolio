# Personal Portfolio (Modular, Data-Driven)

This portfolio loads all content (about, skills, projects, experience, certificates, contact) dynamically from `data.json` and renders sections via `main.js`.

## Data Model

- profile
  - name, brand, titleKeywords[], photo, resume, socials[] (platform, url), footerText
- about
  - intro, features[] (icon, title, text) — Font Awesome icon class suffix (e.g., `fa-brain`)
- skills: array of categories { icon, name, items[] }
  - items can be strings (uses Devicon guess) or objects:
    - { label, provider, id, className? }
    - provider: "skillicons" | "simple-icons" | "devicon" (default)
    - id: icon slug for the provider (e.g., python, javascript, wireshark)
- projects: { title, description, image, tags[], link }
- experience: { role, company, period, bullets[] }
- certificates: { name, issuer, file, year }
- contact: { email, phone, location }

## Run locally

This is a static site. Use any local server so `fetch('data.json')` works.
