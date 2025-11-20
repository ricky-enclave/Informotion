(function () {
  // JS Loaded
  document.body.classList.add("js-loaded");

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

  //  Smoother 
  const smoother = ScrollSmoother.create({
    smooth: 2,
    effects: true,
  });

  // -----------------------
  // Flair Button Effect
  // -----------------------
  class GsapFlairButton {
    constructor(root) {
      this.button = root;
      this.flair = root.querySelector("[data-gsap-btn-flair]");
      if (!this.flair) return;

      this.xSet = gsap.quickSetter(this.flair, "xPercent");
      this.ySet = gsap.quickSetter(this.flair, "yPercent");

      this.initEvents();
    }

    getXY(e) {
      const { left, top, width, height } = this.button.getBoundingClientRect();

      const xTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, width, 0, 100),
        gsap.utils.clamp(0, 100)
      );

      const yTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, height, 0, 100),
        gsap.utils.clamp(0, 100)
      );

      return {
        x: xTransformer(e.clientX - left),
        y: yTransformer(e.clientY - top),
      };
    }

    initEvents() {
      this.button.addEventListener("mouseenter", (e) => {
        const { x, y } = this.getXY(e);

        this.xSet(x);
        this.ySet(y);

        gsap.to(this.flair, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      this.button.addEventListener("mouseleave", (e) => {
        const { x, y } = this.getXY(e);

        gsap.killTweensOf(this.flair);

        gsap.to(this.flair, {
          xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
          yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
          scale: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      this.button.addEventListener("mousemove", (e) => {
        const { x, y } = this.getXY(e);

        gsap.to(this.flair, {
          xPercent: x,
          yPercent: y,
          duration: 0.4,
          ease: "power2",
        });
      });
    }
  }

  // Global helper (Alpine version)
  window.initGsapFlairButton = function (el) {
    if (el.__gsapFlairInited) return;
    el.__gsapFlairInited = true;
    new GsapFlairButton(el);
  };

  // Init all static buttons already in DOM
  document.querySelectorAll("[data-gsap-button]").forEach((el) => window.initGsapFlairButton(el));

  // -----------------------
  // Back To Top
  // ------------------------
  const backToTopBtn = document.querySelector("[data-backtotop]");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      smoother.scrollTo(0, true);
    });
  }

  // -----------------------
// Body BG Color Swap on Section
// -----------------------
const colorSwapSection = document.querySelector("#bgColorSwap");

if (colorSwapSection) {
   
  const colorTl = gsap.timeline({ paused: true });

  colorTl
    
    .to(
      "body",
      {
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        duration: 1.5,
        ease: "power2.out",
      },
      0
    )
    .to(
      "#bgColorSwap .bg-color-swap-card",
      {
        backgroundColor: "var(--color-foreground)",
        color: "var(--color-background)",
        duration: 1.5,
        ease: "power2.out",
      },
      0
    );

  ScrollTrigger.create({
    trigger: colorSwapSection,
    start: "top center",
    // markers: true,
    onEnter: () => colorTl.play(),
    onLeaveBack: () => colorTl.reverse(),
  });
}

 

 // -----------------------
// SplitText: heading + paragraph per section
// -----------------------
gsap.utils.toArray("section").forEach((section) => {
  const heading = section.querySelectorAll(".animate-heading");
  const paragraph = section.querySelectorAll(".animate-paragraph");

  if (!heading.length && !paragraph.length) return;

  let splitHeading, splitParagraph;

  if (heading.length) {
    splitHeading = SplitText.create(heading, {
      type: "words,lines,chars",
      linesClass: "line",
      mask: "lines",
    });
  }

  if (paragraph.length) {
    splitParagraph = SplitText.create(paragraph, {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      once: true,
    },
  });

  if (splitHeading) {
    tl.from(splitHeading.chars, {
      duration: 0.6,
      y: 100,
      opacity: 0,
      stagger: 0.02,
      ease: "expo.out",
    });
  }

  if (splitParagraph) {
    tl.from(
      splitParagraph.lines,
      {
        duration: 1,
        y: 100,
        opacity: 0,
        stagger: 0.1,
        ease: "expo.out",
      },
      "-=0.6"
    );
  }
});

// -----------------------
// Fade-In per section
// -----------------------
gsap.utils.toArray("section").forEach((section) => {
  const fadeInEls = section.querySelectorAll(".animate-fade-in");
  if (!fadeInEls.length) return;

  gsap.from(fadeInEls, {
    scrollTrigger: {
      trigger: section,
      start: "top 30%",
      once: true,
    },
    opacity: 0,
    duration: 1.5,
    stagger: 0.15,
    ease: "power2.out",
  });
});

// -----------------------
// Fade-In-Up per section
// -----------------------
gsap.utils.toArray("section").forEach((section) => {
  const fadeInUpEls = section.querySelectorAll(".animate-fade-in-up");
  if (!fadeInUpEls.length) return;

  gsap.from(fadeInUpEls, {
    scrollTrigger: {
      trigger: section,
      start: "top center",
      once: true,
    },
    opacity: 0,
    y: 40,
    duration: 1.5,
    stagger: 0.15,
    ease: "power3.out",
  });
});

})();