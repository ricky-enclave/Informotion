(function () {
  // JS Loaded
  document.body.classList.add("js-loaded");

  // -----------------------
  // GSAP setup (safe guards)
  // -----------------------
  const hasGSAP = typeof window.gsap !== "undefined";

  if (hasGSAP) {
    // Register plugins only if present (won't break pages missing some plugins)
    const plugins = [];
    if (window.ScrollTrigger) plugins.push(window.ScrollTrigger);
    if (window.ScrollSmoother) plugins.push(window.ScrollSmoother);
    if (window.SplitText) plugins.push(window.SplitText);
    if (window.CustomEase) plugins.push(window.CustomEase);

    if (plugins.length) gsap.registerPlugin(...plugins);

    // Custom ease (only if CustomEase exists)
    if (window.CustomEase) {
      try {
        CustomEase.create("smoothEase", "M0,0 C0.6,0 0.14,0.98 1,1");
      } catch (e) {
        // ignore if already created
      }
    }
  }

  // -----------------------
  // ScrollSmoother  
  // -----------------------
  let smoother = null;
  if (hasGSAP && window.ScrollSmoother) {
    try {
      smoother = ScrollSmoother.create({
        smooth: 2,
        effects: true,
      });
    } catch (e) {
      // ignore if ScrollSmoother can't init on some pages
    }
  }

  // -----------------------
  // Back To Top  
  // -----------------------
  const backToTopBtn = document.querySelector("[data-backtotop]");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (smoother) smoother.scrollTo(0, true);
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // -----------------------
  // Flair Button — Slide Up  
  // -----------------------
  window.initFlairButton = (btn) => {
    if (!hasGSAP) return;
    if (!btn || btn.__flairInit) return;
    btn.__flairInit = true;

    const flair = btn.querySelector("[data-flair-bg]");
    const wrapper = btn.querySelector("[data-flair-text]");
    if (!flair || !wrapper) return;

    const [t1, t2, t3] = wrapper.children;
    if (!t1 || !t2 || !t3) return;

    // initial
    gsap.set(flair, { yPercent: 100 });

    gsap.set(t1, { yPercent: 0, clipPath: "inset(0% 0% 0% 0)" });
    gsap.set([t2, t3], { yPercent: 0, clipPath: "inset(100% 0% 0% 0)" });

    btn.addEventListener("mouseenter", () => {
      gsap.killTweensOf([flair, t1, t2, t3]);

      gsap.set(flair, { yPercent: 100 });
      gsap.to(flair, {
        yPercent: 0,
        duration: 0.5,
        ease: "smoothEase",
      });

      gsap.to([t1, t2, t3], {
        yPercent: -100,
        duration: 0.5,
        ease: "expo.out",
      });

      gsap.to(t1, {
        clipPath: "inset(100% 0% 0% 0)",
        duration: 0.5,
        ease: "smoothEase",
      });

      gsap.to(t2, {
        clipPath: "inset(0% 0% 0% 0)",
        duration: 0.5,
        ease: "smoothEase",
      });

      gsap.set(t3, { clipPath: "inset(100% 0% 0% 0)" });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.killTweensOf([flair, t1, t2, t3]);

      gsap.to(flair, {
        yPercent: -100,
        duration: 0.5,
        ease: "smoothEase",
      });

      gsap.to([t1, t2, t3], {
        yPercent: -200,
        duration: 0.5,
        ease: "smoothEase",
        onComplete() {
          if (!btn.matches(":hover")) {
            gsap.set(flair, { yPercent: 100 });
            gsap.set(t1, { yPercent: 0, clipPath: "inset(0% 0% 0% 0)" });
            gsap.set([t2, t3], { yPercent: 0, clipPath: "inset(100% 0% 0% 0)" });
          }
        },
      });

      gsap.to(t2, {
        clipPath: "inset(100% 0% 0% 0)",
        duration: 0.5,
        ease: "smoothEase",
      });

      gsap.to(t3, {
        clipPath: "inset(0% 0% 0% 0)",
        duration: 0.5,
        ease: "smoothEase",
      });
    });
  };

  // init flair buttons in static DOM
  if (hasGSAP) {
    document.querySelectorAll("[data-flair-btn]").forEach((btn) => window.initFlairButton(btn));
  }

  // -----------------------
  // SplitText + Fade animations per section
  // -----------------------
  if (hasGSAP && window.ScrollTrigger && window.SplitText && document.fonts?.ready) {
    document.fonts.ready.then(() => {
      gsap.utils.toArray("section").forEach((section) => {
        const items = section.querySelectorAll(
          "[data-animate-heading], [data-animate-paragraph], [data-animate-zoom-in], [data-animate-fade-up], [data-animate-fade-in], [data-animate-line]"
        );
        if (!items.length) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            once: true,
          },
        });

        tl.call(() => {
          items.forEach((n) => (n.style.visibility = "visible"));
        }, null, 0);

        items.forEach((el, index) => {
          const position = index === 0 ? 0 : "<+=0.2";

          if (el.hasAttribute("data-animate-heading")) {
            const split = SplitText.create(el, {
              type: "lines, words",
              linesClass: "line",
              mask: "words",
            });

            tl.fromTo(
              split.lines,
              {
                clipPath: "inset(0% 0% 100% 0%)",
                opacity: 0,
                yPercent: 200,
                scaleX: 0.95,
                rotateX: 60,
              },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                opacity: 1,
                yPercent: 0,
                scaleX: 1,
                duration: 1.2,
                stagger: 0.1,
                rotateX: 0,
                transformOrigin: "50% 100%",
                ease: "expo.out",
                delay: index === 0 ? 0.2 : 0,
              },
              position
            );
          } else if (el.hasAttribute("data-animate-paragraph")) {
            const split = SplitText.create(el, {
              type: "lines, words",
              linesClass: "line",
              mask: "words",
            });

            tl.from(
              split.lines,
              {
                duration: 1.0,
                yPercent: 100,
                opacity: 0,
                clipPath: "inset(0% 0% 100% 0%)",
                transformOrigin: "50% 100%",
                stagger: 0.08,
                ease: "expo.out",
              },
              position
            );
          } else if (el.hasAttribute("data-animate-zoom-in")) {
            tl.from(
              el,
              {
                opacity: 0,
                scale: 1.2,
                duration: 1.0,
                ease: "power2.out",
              },
              position
            );
          } else if (el.hasAttribute("data-animate-fade-up")) {
            tl.from(
              el,
              {
                y: 40,
                opacity: 0,
                scale: 0.98,
                willChange: "transform,opacity,filter",
                duration: 1.0,
                ease: "power3.out",
                clearProps: "transform,opacity,filter,willChange",
              },
              position
            );
          } else if (el.hasAttribute("data-animate-fade-in")) {
            tl.from(
              el,
              {
                opacity: 0,
                willChange: "transform,opacity,filter",
                duration: 1.0,
                ease: "power3.out",
                clearProps: "transform,opacity,filter,willChange",
              },
              position
            );
          } else if (el.hasAttribute("data-animate-line")) {
            gsap.set(el, { transformOrigin: "left center" });
            tl.from(
              el,
              {
                scaleX: 0,
                duration: 1.0,
                ease: "power2.out",
              },
              index === 0 ? 0 : "<-=0.25"
            );
          }
        });
      });

      ScrollTrigger.refresh();
    });
  }

  // -----------------------
  // Swiper: Info slider + pager
  // -----------------------
  const infoEl = document.querySelector(".infoSwiper");
  const progressBar = document.querySelector("[data-progress-bar]");

  if (infoEl && typeof window.Swiper !== "undefined") {
    function updatePager(swiper) {
      if (!progressBar) return;

      const totalPages = swiper.snapGrid?.length || 1;  
      const pageIndex = swiper.snapIndex ?? 0;

      const widthPct = totalPages <= 1 ? 100 : 100 / totalPages;
      progressBar.style.width = `${widthPct}%`;

      progressBar.style.left = `${pageIndex * widthPct}%`;
    }

    const infoSwiper = new Swiper(".infoSwiper", {
      speed: 400,
      spaceBetween: 20,
      loop: false,

      slidesPerView: 1,
      slidesPerGroup: 1,

      navigation: {
        nextEl: ".js-info-next",
        prevEl: ".js-info-prev",
      },

      breakpoints: {
        0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
        1024: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
        1280: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 20 },
      },

      on: {
        init(swiper) {
          updatePager(swiper);
        },
        slideChange(swiper) {
          updatePager(swiper);
        },
        breakpoint(swiper) {
          updatePager(swiper);
        },
        resize(swiper) {
          updatePager(swiper);
        },
      },
    });
  }

  // -----------------------
  // Swiper: Related slider 
  // -----------------------
  const relatedEl = document.querySelector(".relatedSwiper");

  if (relatedEl && typeof window.Swiper !== "undefined") {

    const relatedEl = new Swiper(".relatedSwiper", {
      speed: 400,
      spaceBetween: 20,
      loop: false,

      slidesPerView: 1,
      slidesPerGroup: 1,

      navigation: {
        nextEl: ".js-related-next",
        prevEl: ".js-related-prev",
      },

      breakpoints: {
        0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
        1024: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
        1280: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20 },
      },
    });
  }

  // -----------------------
  // Testimonials: Info slider + pager
  // -----------------------

  const testimonialsEl = document.querySelector("[data-testimonials-swiper]");
  if (testimonialsEl && typeof window.Swiper !== "undefined") {

  new Swiper(testimonialsEl, {
    speed: 600,
    loop: false,
    slidesPerView: 1,
    spaceBetween: 0,
    autoHeight: true,

    navigation: {
      nextEl: ".js-testimonials-next",
      prevEl: ".js-testimonials-prev",
    },

    pagination: {
      el: ".js-testimonials-pagination",
      // clickable: true,
    },
  });
 }
  

  // -----------------------
  // Logo marquee (GSAP)
  // -----------------------
  function initLogoMarquee(root) {
    if (!root || !hasGSAP) return;

    const track = root.querySelector("[data-track]");
    const row = root.querySelector("[data-row]");
    const clone = root.querySelector("[data-row-clone]");
    if (!track || !row || !clone) return;

    // clone once
    clone.innerHTML = row.innerHTML;

    let tween;
    let isVisible = true;

    const build = () => {
      tween?.kill();
      gsap.set(track, { x: 0 });

      const distance = row.scrollWidth;
      const pxPerSecond = 120;  
      const duration = distance / pxPerSecond;

      tween = gsap.to(track, {
        x: -distance,
        duration,
        ease: "none",
        repeat: -1,
        paused: !isVisible,
      });
    };

    build();

    const ro = new ResizeObserver(build);
    ro.observe(row);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (!tween) return;
        isVisible ? tween.resume() : tween.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(root);

    root.addEventListener("mouseenter", () => tween?.pause());
    root.addEventListener("mouseleave", () => isVisible && tween?.resume());
  }

  document.querySelectorAll("[data-logo-marquee]").forEach(initLogoMarquee);

    // -----------------------
  // Count-Up animation for stats (optional)
  // -----------------------
  if (hasGSAP && window.ScrollTrigger) {
    gsap.utils.toArray("[data-animate-counter]").forEach((el) => {
      const endValue = parseInt(el.getAttribute("data-animate-counter"), 10);
      if (isNaN(endValue)) return;

      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: endValue,
          duration: 1.8,
          ease: "power1.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: el.closest("section") || el,
            start: "top center",
            once: true,
          },
          onUpdate: function () {
            el.innerText = Math.round(Number(el.innerText));
          },
        }
      );
    });
  }

  // -----------------------
// Timeline (VERTICAL DOT) — pin + scrub steps
// -----------------------
function initTimelineVertical() {
  const section = document.querySelector("[data-timeline-section]") || document.querySelector("[data-timeline]")?.closest("section");
  if (!section || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const timeline = section.querySelector("[data-timeline]");
  const dot = section.querySelector("[data-timeline-dot]");
  const yearEls = Array.from(section.querySelectorAll("[data-timeline-year]"));

  
  const entries = Array.from(section.querySelectorAll("[data-timeline-entry]"));
  const entriesWrapper = section.querySelector("[data-timeline-entries]");

  if (!timeline || !dot || yearEls.length === 0) return;

  // ----------------------
  // Dot Y positions (center of each year label)
  // ----------------------
  const getPositions = () => {
    const barRect = timeline.getBoundingClientRect();
    return yearEls.map((year) => {
      const r = year.getBoundingClientRect();
      // y position inside timeline box (relative)
      return r.top + r.height / 2 - barRect.top;
    });
  };

  let positions = getPositions();

  const moveDot = gsap.quickTo(dot, "y", {
    duration: 0.6,
    ease: "power2.out",
  });

  // ----------------------
  // Active state
  // ----------------------
  let currentIndex = 0;

  const setActive = (index) => {
    if (index === currentIndex) return;
    currentIndex = index;

    yearEls.forEach((el, i) => el.classList.toggle("is-active", i === index));

    // If you still use entries (old version), fade between them
    if (entries.length) {
      entries.forEach((entry, i) => {
        gsap.to(entry, {
          autoAlpha: i === index ? 1 : 0,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    }

    moveDot(positions[index]);
  };

  // initial
  yearEls.forEach((el, i) => el.classList.toggle("is-active", i === 0));
  moveDot(positions[0]);

  // old version: initial visibility + auto wrapper height
  const resizeWrapper = () => {
    if (!entriesWrapper || !entries.length) return;

    let maxH = 0;
    entries.forEach((entry) => {
      const prevPos = entry.style.position;
      const prevTop = entry.style.top;
      const prevLeft = entry.style.left;
      const prevRight = entry.style.right;
      const prevBottom = entry.style.bottom;

      entry.style.position = "static";
      entry.style.top = entry.style.left = entry.style.right = entry.style.bottom = "";

      const h = entry.offsetHeight;
      if (h > maxH) maxH = h;

      entry.style.position = prevPos || "absolute";
      entry.style.top = prevTop || "0";
      entry.style.left = prevLeft || "0";
      entry.style.right = prevRight || "0";
      entry.style.bottom = prevBottom || "0";
    });

    entriesWrapper.style.height = maxH + "px";
  };

  if (entries.length) {
    entries.forEach((entry, i) => gsap.set(entry, { autoAlpha: i === 0 ? 1 : 0 }));
    resizeWrapper();
  }

  // ----------------------
  // One ScrollTrigger controlling all steps
  // ----------------------
  const st = ScrollTrigger.create({
    trigger: section,
    start: window.screen.width > 1024 ? "center center" :  "30% top",
    end: () => "+=" + window.innerHeight * 0.6 * (yearEls.length - 1),
    pin: true,
    scrub: true,
    // markers: true,
    onUpdate: (self) => {
      const step = Math.round(self.progress * (yearEls.length - 1));
      const clamped = Math.min(yearEls.length - 1, Math.max(0, step));
      setActive(clamped);
    },
  });

  // Recalc on resize / refresh / load
  const recalc = () => {
    positions = getPositions();
    moveDot(positions[currentIndex]);
    resizeWrapper();
    st?.refresh();
  };

  window.addEventListener("resize", recalc);
  ScrollTrigger.addEventListener("refreshInit", recalc);

  window.addEventListener("load", () => {
    recalc();
    ScrollTrigger.refresh();
  });
}

initTimelineVertical();
  
})();