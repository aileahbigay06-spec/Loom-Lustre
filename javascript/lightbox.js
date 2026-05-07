(function () {
  const lightbox      = document.getElementById("lightbox");
  const lightboxImg   = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBack  = document.getElementById("lightboxBackdrop");
  const caption       = document.getElementById("lightboxCaption");

  if (!lightbox) return;

  /* ── Collect all gallery images ── */
  const galleryImgs = Array.from(
    document.querySelectorAll(".layout-grid img")
  );

  let currentIndex = 0;

  /* ── Open lightbox ── */
  function openLightbox(img, index) {
    currentIndex = index;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "Gallery image";

    // Find parent section to get chapter name
    const section = img.closest(".layout-section");
    const chapterLabel = section
      ? section.querySelector(".chapter-label")?.textContent
      : null;
    const chapterTitle = section
      ? section.querySelector("h2")?.textContent
      : null;
    caption.textContent =
      chapterLabel && chapterTitle
        ? `${chapterLabel} — ${chapterTitle}`
        : "";

    // Reset image scale before animating in
    lightboxImg.style.transform = "scale(0.88)";
    lightboxImg.style.opacity   = "0";

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";

    // Small timeout so transition triggers after display:flex
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lightboxImg.style.transform = "scale(1)";
        lightboxImg.style.opacity   = "1";
      });
    });
  }

  /* ── Close lightbox ── */
  function closeLightbox() {
    lightboxImg.style.transform = "scale(0.92)";
    lightboxImg.style.opacity   = "0";

    setTimeout(() => {
      lightbox.classList.remove("active");
      lightboxImg.src = "";
      document.body.style.overflow = "";
    }, 340);
  }

  /* ── Bind gallery images ── */
  galleryImgs.forEach((img, i) => {
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "View full size");
    img.style.cursor = "zoom-in";

    img.addEventListener("click", () => openLightbox(img, i));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img, i);
      }
    });
  });

  /* ── Close triggers ── */
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxBack.addEventListener("click", closeLightbox);

  /* ── Keyboard navigation ── */
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      const next = (currentIndex + 1) % galleryImgs.length;
      openLightbox(galleryImgs[next], next);
    } else if (e.key === "ArrowLeft") {
      const prev = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
      openLightbox(galleryImgs[prev], prev);
    }
  });

  /* ── Prevent scroll‑through while open ── */
  lightbox.addEventListener("wheel", (e) => e.stopPropagation(), {
    passive: true,
  });
})();