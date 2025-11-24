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



gsap.utils.toArray("[data-flair-btn]").forEach((btn) => {
  const flair = btn.querySelector("[data-flair-bg]");
  const wrapper = btn.querySelector("[data-flair-text]");
  if (!flair || !wrapper) return;

  const [t1, t2, t3] = wrapper.children;

  // initial states
  gsap.set(flair, { yPercent: 100 });   // flair below
  gsap.set([t1, t2, t3], { yPercent: 0 }); // all texts at natural positions

  btn.addEventListener("mouseenter", () => {
    gsap.killTweensOf([flair, t1, t2, t3]);

    // flair: bottom -> center
    gsap.set(flair, { yPercent: 100 });
    gsap.to(flair, {
      yPercent: 0,
      duration: 0.5,
      ease: "expo.out",
    });

    // text: all from 0 -> -100
    gsap.to([t1, t2, t3], {
      yPercent: -100,
      duration: 0.5,
      ease: "expo.out",
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.killTweensOf([flair, t1, t2, t3]);

    // flair: center -> top
    gsap.to(flair, {
      yPercent: -100,
      duration: 0.5,
      ease: "expo.out",
    });

    // text: all from -100 -> -200
    gsap.to([t1, t2, t3], {
      yPercent: -200,
      duration: 0.5,
      ease: "expo.out",
      onComplete() {
        // reset everything back to start (invisible jump)
        gsap.set(flair, { yPercent: 100 });
        gsap.set([t1, t2, t3], { yPercent: 0 });
      },
    });
  });
});



 // -----------------------
// Flair Button — Slide Up / Reset Loop
// -----------------------
window.initFlairButton = (btn) => {
  if (btn.__flairInit) return;
  btn.__flairInit = true;

  const flair   = btn.querySelector("[data-flair-bg]");
  const wrapper = btn.querySelector("[data-flair-text]");
  const icon    = btn.querySelector("[data-flair-icon], svg"); // optional icon

  if (!flair || !wrapper) return;

  const [t1, t2, t3] = wrapper.children;

  // ------------------------
  // Initial state
  // ------------------------
  gsap.set(flair, { yPercent: 100 });

  // only first text visible, others clipped
  gsap.set(t1, { yPercent: 0, clipPath: "inset(0% 0% 0% 0)" });
  gsap.set([t2, t3], { yPercent: 0, clipPath: "inset(100% 0% 0% 0)" });

  if (icon) {
    gsap.set(icon, { transformOrigin: "60% 40%" }); 
  }

  const bounceIcon = () => {
    if (!icon) return;
    gsap.killTweensOf(icon);
    gsap.fromTo(
      icon,
      { scale: 1 },
      {
        scale: 0.75,
        duration: 0.16,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      }
    );
  };

  // ------------------------
  // Hover enter
  // ------------------------
  btn.addEventListener("mouseenter", () => {
    gsap.killTweensOf([flair, t1, t2, t3]);

    // flair: bottom -> center
    gsap.set(flair, { yPercent: 100 });
    gsap.to(flair, {
      yPercent: 0,
      duration: 0.5,
      ease: "expo.out",
    });

    // text motion: all 0 -> -100
    gsap.to([t1, t2, t3], {
      yPercent: -100,
      duration: 0.5,
      ease: "expo.out",
    });

    // clipping: t1 hides, t2 shows, t3 stays hidden
    gsap.to(t1, {
      clipPath: "inset(100% 0% 0% 0)",
      duration: 0.5,
      ease: "expo.out",
    });

    gsap.to(t2, {
      clipPath: "inset(0% 0% 0% 0)",
      duration: 0.5,
      ease: "expo.out",
    });

    gsap.set(t3, { clipPath: "inset(100% 0% 0% 0)" });

    bounceIcon();
  });

  // ------------------------
  // Hover leave
  // ------------------------
  btn.addEventListener("mouseleave", () => {
    gsap.killTweensOf([flair, t1, t2, t3]);

    // flair: center -> top
    gsap.to(flair, {
      yPercent: -100,
      duration: 0.5,
      ease: "expo.out",
    });

    // text motion: all -100 -> -200
    gsap.to([t1, t2, t3], {
      yPercent: -200,
      duration: 0.5,
      ease: "expo.out",
      onComplete() {
        // reset everything back to initial only when truly not hovered
        if (!btn.matches(":hover")) {
          gsap.set(flair, { yPercent: 100 });
          gsap.set(t1, { yPercent: 0, clipPath: "inset(0% 0% 0% 0)" });
          gsap.set([t2, t3], {
            yPercent: 0,
            clipPath: "inset(100% 0% 0% 0)",
          });
        }
      },
    });

    // clipping: t2 hides, t3 shows
    gsap.to(t2, {
      clipPath: "inset(100% 0% 0% 0)",
      duration: 0.5,
      ease: "expo.out",
    });

    gsap.to(t3, {
      clipPath: "inset(0% 0% 0% 0)",
      duration: 0.5,
      ease: "expo.out",
    });

    bounceIcon();
  });
};

// init for static DOM
document.querySelectorAll("[data-flair-btn]").forEach((btn) => window.initFlairButton(btn));

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
// const colorSwapSection = document.querySelector("#bgColorSwap");

// if (colorSwapSection) {
   
//   const colorTl = gsap.timeline({ paused: true });

//   colorTl
    
//     .to(
//       "body",
//       {
//         backgroundColor: "var(--color-background)",
//         color: "var(--color-foreground)",
//         duration: 1.5,
//         ease: "power2.out",
//       },
//       0
//     )
//     .to(
//       "#bgColorSwap .bg-color-swap-card",
//       {
//         backgroundColor: "var(--color-foreground)",
//         color: "var(--color-background)",
//         duration: 1.5,
//         ease: "power2.out",
//       },
//       0
//     );

//   ScrollTrigger.create({
//     trigger: colorSwapSection,
//     start: "top center",
//     // markers: true,
//     onEnter: () => colorTl.play(),
//     onLeaveBack: () => colorTl.reverse(),
//   });
// }

 

 // -----------------------
// SplitText: heading + paragraph per section
// -----------------------
 

document.fonts.ready.then(() => {
  gsap.utils.toArray("section").forEach((section) => {
    const heading = section.querySelectorAll(".animate-heading");
    const paragraph = section.querySelectorAll(".animate-paragraph");

    if (!heading.length && !paragraph.length) return;

    let splitHeading, splitParagraph;

    if (heading.length) {
      splitHeading = SplitText.create(heading, {
        type: "lines, words",
        linesClass: "line",
        mask: "words",
      });
    }

    if (paragraph.length) {
      splitParagraph = SplitText.create(paragraph, {
        type: "lines, words",
        linesClass: "line",
        mask: "words",
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
      tl.fromTo(
        splitHeading.lines,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          opacity: 0,
          yPercent: 200,
          scaleX: 0.95,
          rotateX: 60
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
          delay: 0.2
        }
      );
    }
  
    if (splitParagraph) {
      tl.from(
        splitParagraph.lines,
        {
          duration: 1.0,
          yPercent: 100,
          opacity: 0,
          clipPath: "inset(0% 0% 100% 0%)",
          transformOrigin: "50% 100%",
          stagger: 0.08,
          ease: "expo.out",
        },
        "-=0.8"  
      );
    }
  });

   
  ScrollTrigger.refresh();
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
      start: "top center",
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