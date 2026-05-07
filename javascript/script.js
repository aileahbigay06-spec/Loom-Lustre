/**
 *
 * TABLE OF CONTENTS
 * 01. Page Initialization
 * 02. Page Load Fade
 * 03. Custom Cursor
 * 04. Nav Scroll State
 * 05. Mobile Hamburger Toggle
 * 06. Mobile Menu Auto-Close
 * 07. Hero Video Sound Toggle
 * 08. Scroll-Triggered Reveal Animations
 * 09. Dynamic Active Nav Links
 * 10. Smooth Anchor Scrolling
 * 11. Hero Video Parallax
 * 12. Scroll Progress Bar
 * 13. Teaser Card Data Attributes
 * 14. Global Scroll Handler
 */

document.addEventListener("DOMContentLoaded", pload);

let revealElements = [];

function pload() {
  pageLoadFade();
  setupCustomCursor();
  setupNavScrollState();
  setupHamburger();
  setupAutoCloseMenu();
  setupSoundToggle();
  setupRevealOnScroll();
  setupActiveNavOnScroll();
  setupSmoothAnchorScroll();
  setupParallaxHero();
  setupScrollProgressBar();
  setupTeaserLabels();

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("load", handleScroll);
}


/* ─────────────────────────────────────────────
   01. PAGE LOAD FADE
───────────────────────────────────────────── */
function pageLoadFade() {
  document.body.classList.add("loaded");
}


/* ─────────────────────────────────────────────
   02. CUSTOM CURSOR
───────────────────────────────────────────── */
function setupCustomCursor() {
  // Only desktop
  if (window.innerWidth <= 768) return;

  const dot  = document.createElement("div");
  const ring = document.createElement("div");
  dot.className  = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top  = mouseY + "px";
  });

  // Smooth lag for ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top  = ringY + "px";
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = "a, button, .teaser-card, .layout-grid img, .social-link, .inquiry-btn, .cta-btn";
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
  });

  // Also apply to dynamically detected elements
  document.addEventListener("mouseover", e => {
    if (e.target.closest("a, button, .cta-btn, .inquiry-btn, .social-link")) {
      ring.classList.add("hovering");
    } else {
      ring.classList.remove("hovering");
    }
  });

  // Hide on leave
  document.addEventListener("mouseleave", () => { dot.style.opacity = "0"; ring.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { dot.style.opacity = "1"; ring.style.opacity = "1"; });
}


/* ─────────────────────────────────────────────
   03. NAV SCROLL STATE
───────────────────────────────────────────── */
function setupNavScrollState() {
  const nav = document.querySelector("nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}


/* ─────────────────────────────────────────────
   04. MOBILE HAMBURGER
───────────────────────────────────────────── */
function setupHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navMenu   = document.getElementById("nav-menu");
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
}


/* ─────────────────────────────────────────────
   05. MOBILE MENU AUTO-CLOSE
───────────────────────────────────────────── */
function setupAutoCloseMenu() {
  const links     = document.querySelectorAll("#nav-menu a");
  const navMenu   = document.getElementById("nav-menu");
  const hamburger = document.getElementById("hamburger");

  links.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}


/* ─────────────────────────────────────────────
   06. HERO VIDEO SOUND TOGGLE
───────────────────────────────────────────── */
function setupSoundToggle() {
  const soundBtn = document.getElementById("soundToggle");
  const video    = document.getElementById("bgVideo");
  if (!soundBtn || !video) return;

  soundBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? "🔇" : "🔊";
  });
}


/* ─────────────────────────────────────────────
   07. SCROLL-TRIGGERED REVEAL ANIMATIONS
───────────────────────────────────────────── */
function setupRevealOnScroll() {
  revealElements = [
    ...document.querySelectorAll(".reveal"),
    ...document.querySelectorAll(".reveal-left"),
    ...document.querySelectorAll(".reveal-right"),
  ];
  // Stagger children within reveal containers
  document.querySelectorAll(".layout-grid").forEach(grid => {
    [...grid.children].forEach((img, i) => {
      img.style.transitionDelay = `${(i % 4) * 60}ms`;
    });
  });
}

function revealOnScroll() {
  const windowH = window.innerHeight;
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowH - 90) el.classList.add("active");
  });
}


/* ─────────────────────────────────────────────
   08. ACTIVE NAV LINKS
───────────────────────────────────────────── */
function setupActiveNavOnScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  function updateActiveLink() {
    navLinks.forEach(a => a.classList.remove("active"));
    const pageLink = [...navLinks].find(a => a.getAttribute("href") === currentPage);
    if (pageLink) pageLink.classList.add("active");

    const scrollY = window.pageYOffset;
    sections.forEach(sec => {
      const top    = sec.offsetTop - 160;
      const height = sec.offsetHeight;
      const id     = sec.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        const sLink = [...navLinks].find(a => a.getAttribute("href") === "#" + id);
        if (sLink) sLink.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
}


/* ─────────────────────────────────────────────
   09. SMOOTH ANCHOR SCROLLING
───────────────────────────────────────────── */
function setupSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = document.querySelector("nav")?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}


/* ─────────────────────────────────────────────
   10. HERO VIDEO PARALLAX
───────────────────────────────────────────── */
function setupParallaxHero() {
  const video = document.querySelector(".hero-video");
  if (!video) return;
  window.addEventListener("scroll", () => {
    const offset = window.pageYOffset;
    if (offset < window.innerHeight) {
      video.style.transform = `translateY(${offset * 0.28}px) scale(1.05)`;
    }
  }, { passive: true });
}


/* ─────────────────────────────────────────────
   11. SCROLL PROGRESS BAR
───────────────────────────────────────────── */
function setupScrollProgressBar() {
  const bar = document.createElement("div");
  bar.id = "scrollProgress";
  document.body.appendChild(bar);
}

function updateScrollProgress() {
  const bar      = document.getElementById("scrollProgress");
  if (!bar) return;
  const scrollTop = window.scrollY;
  const height    = document.body.scrollHeight - window.innerHeight;
  bar.style.width = ((scrollTop / height) * 100) + "%";
}


/* ─────────────────────────────────────────────
   12. TEASER CARD LABELS
───────────────────────────────────────────── */
function setupTeaserLabels() {
  // Add data-num to teaser cards for CSS counter ornament
  document.querySelectorAll(".teaser-card").forEach((card, i) => {
    card.setAttribute("data-num", String(i + 1).padStart(2, "0"));
  });
}


/* ─────────────────────────────────────────────
   13. GLOBAL SCROLL HANDLER
───────────────────────────────────────────── */
function handleScroll() {
  revealOnScroll();
  updateScrollProgress();
}

