// script.js — small enhancements for smoother UI
// Features:
// - responsive nav toggle
// - smooth scrolling for internal links (respects prefers-reduced-motion)
// - reveal-on-scroll using IntersectionObserver
// - subtle header shadow on scroll

document.addEventListener("DOMContentLoaded", function () {
  // Respect reduced motion
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // NAV TOGGLE
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.getElementById("primary-navigation");
  if (navToggle && navList) {
    const handleNavToggle = () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navToggle.classList.toggle("open");
      navList.classList.toggle("open");
      // lock body scroll when nav open on mobile
      if (navList.classList.contains("open"))
        document.body.classList.add("nav-open");
      else document.body.classList.remove("nav-open");
      if (!reduceMotion) {
        navList.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 180,
          easing: "ease-out",
        });
      }
    };
    navToggle.addEventListener("click", handleNavToggle);

    // Tambahkan event listener untuk menutup menu saat link diklik di mobile
    navList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navList.classList.contains("open")) {
          handleNavToggle();
        }
      });
    });
  }

  // SMOOTH SCROLL for internal links
  if (!reduceMotion) {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      if (anchor.getAttribute("href").length > 1) {
        // Abaikan link hanya '#'
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
          });
        });
      }
    });
  }

  // HEADER SCROLL SHADOW
  const header = document.querySelector(".site-header");
  if (header) {
    const updateHeaderShadow = () => {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    updateHeaderShadow();
    window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  }

  // INTERSECTION OBSERVER for fade-in effect
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  // Perbarui selector untuk hero section (Menghapus .timeline-content)
  document
    .querySelectorAll(".hero-content, .about-text, .about-image, .feature-card")
    .forEach((el) => {
      observer.observe(el);
    });

  // CLOSE nav on window resize for desktop
  if (navList && navToggle) {
    window.addEventListener("resize", () => {
      // Hanya tutup jika layar lebih besar dari breakpoint mobile (820px)
      // dan nav sedang terbuka
      if (window.innerWidth > 820 && navList.classList.contains("open")) {
        navList.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      }
    });
  }

  // SCROLL TO TOP button
  const scrollBtn = document.getElementById("scrollTop");
  const showAt = 240;
  if (scrollBtn) {
    const updateScrollBtn = () => {
      if (window.scrollY > showAt) scrollBtn.classList.add("show");
      else scrollBtn.classList.remove("show");
    };
    // respect reduced motion preference
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (reduceMotion) window.scrollTo({ top: 0 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
    updateScrollBtn();
    window.addEventListener("scroll", updateScrollBtn, { passive: true });
  }

  // Make logo clickable / keyboard-accessible to go top
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      if (reduceMotion) window.scrollTo({ top: 0 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
    logo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (reduceMotion) window.scrollTo({ top: 0 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
});
