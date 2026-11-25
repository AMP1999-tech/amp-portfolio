document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Reveal sections, cards, and table rows smoothly as they enter the viewport
  const revealTargets = document.querySelectorAll(
    "section, .content-box, .card, .table tbody tr"
  );

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    revealTargets.forEach((el, index) => {
      el.classList.add("anim-reveal");
      // Slight stagger on table rows so they cascade in naturally
      if (el.matches(".table tbody tr")) {
        el.style.transitionDelay = `${Math.min(index * 60, 360)}ms`;
      }
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

  // Gentle click pop animation on links, buttons, and table cells
  if (!prefersReducedMotion) {
    document.addEventListener("click", (event) => {
      const interactive = event.target.closest(
        "a, button, .table td:not(.table-label)"
      );
      if (!interactive) return;

      interactive.classList.remove("anim-pop");
      // Trigger reflow so rapid clicks can replay the pop
      void interactive.offsetWidth;
      interactive.classList.add("anim-pop");
    });

    document.addEventListener("animationend", (event) => {
      if (event.target.classList?.contains("anim-pop")) {
        event.target.classList.remove("anim-pop");
      }
    });
  }
});

// Highlight focused personal/contact links smoothly for keyboard navigation
  document.querySelectorAll(".table a, #contact a").forEach((link) => {
    link.addEventListener("focus", () => link.classList.add("is-focused"));
    link.addEventListener("blur", () => link.classList.remove("is-focused"));
  });