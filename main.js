// Loading overlay fade-out
window.addEventListener("load", () => {
  const loader = document.getElementById("loadingOverlay");
  loader.classList.add("fade-out");
  setTimeout(() => (loader.style.display = "none"), 500);
});

// Navbar shrink on scroll
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("mainNavbar");
  navbar.classList.toggle("navbar-scrolled", window.scrollY > 50);
});

// AOS init
AOS.init({
  duration: 800,
  once: true,
});

// Typed.js init
new Typed("#typed-text", {
  strings: ["Networking", "Cybersecurity", "Web Development", "Data Analysis"],
  typeSpeed: 60,
  backSpeed: 40,
  loop: true,
});
