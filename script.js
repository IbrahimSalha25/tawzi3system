document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer for Fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Counter animation for numbers
        if (entry.target.classList.contains("impact-item")) {
          const numberEl = entry.target.querySelector(".number");
          const target = parseInt(numberEl.getAttribute("data-target"));
          animateNumber(numberEl, target);
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function animateNumber(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / target));

    // Slow down if stepTime is too small
    const actualStepTime = Math.max(stepTime, 20);
    const increment = target / (duration / actualStepTime);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.innerText = "+" + Math.floor(target);
        clearInterval(timer);
      } else {
        element.innerText = "+" + Math.floor(current);
      }
    }, actualStepTime);
  }

  const elementsToAnimate = document.querySelectorAll(
    ".feature-card, .hero-title, .hero-subtitle, .hero-buttons, .section-title, .vision-content, .audience-card, .impact-item, .support-card, .cta-item, .footer-col, .success-card"
  );

  elementsToAnimate.forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  // Smooth Scroll for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Simple parallax effect for hero image on mouse move
  const heroImage = document.querySelector(".image-wrapper");
  const heroSection = document.querySelector(".hero");

  if (heroImage && heroSection) {
    heroSection.addEventListener("mousemove", (e) => {
      const x = (window.innerWidth - e.pageX * 2) / 100;
      const y = (window.innerHeight - e.pageY * 2) / 100;

      heroImage.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
    });

    heroSection.addEventListener("mouseleave", () => {
      heroImage.style.transform = `perspective(1000px) rotateY(-5deg) rotateX(2deg)`; // reset to default
    });
  }

  // Contact Form Handling
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;

      submitBtn.disabled = true;
      submitBtn.innerText = "جاري الإرسال...";
      formMessage.style.display = "none";
      formMessage.className = "form-message";

      const formData = new FormData(contactForm);
      const GOOGLE_FORM_URL =
        "https://docs.google.com/forms/d/e/1FAIpQLSec7SvDd2W0r6xPpRed4AIh1Nq4iBYKHxoSgma9jSlQYfzfew/formResponse";

      try {
        await fetch(GOOGLE_FORM_URL, {
          method: "POST",
          mode: "no-cors",
          body: formData,
        });

        // Since no-cors returns an opaque response, we assume success if no network error occurred.
        formMessage.innerText = "تم إرسال رسالتك بنجاح! شكراً للتواصل معنا.";
        formMessage.classList.add("success");
        formMessage.style.display = "block";
        contactForm.reset();
      } catch (error) {
        console.error("Error submitting form:", error);
        formMessage.innerText =
          "عذراً، حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.";
        formMessage.classList.add("error");
        formMessage.style.display = "block";
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      }
    });
  }

  // Privacy Policy Modal Handling
  const privacyLink = document.getElementById("privacyLink");
  const privacyModal = document.getElementById("privacyModal");
  const closePrivacyModal = document.querySelector(".close-modal");
  const closePrivacyBtn = document.querySelector(".close-modal-btn");

  if (privacyLink && privacyModal) {
    privacyLink.addEventListener("click", (e) => {
      e.preventDefault();
      privacyModal.style.display = "block";
      document.body.style.overflow = "hidden"; // Disable scroll
    });

    const closeModal = () => {
      privacyModal.style.display = "none";
      document.body.style.overflow = "auto"; // Enable scroll
    };

    if (closePrivacyModal) {
      closePrivacyModal.addEventListener("click", closeModal);
    }

    if (closePrivacyBtn) {
      closePrivacyBtn.addEventListener("click", closeModal);
    }

    window.addEventListener("click", (e) => {
      if (e.target == privacyModal) {
        closeModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && privacyModal.style.display === "block") {
        closeModal();
      }
    });
  }

  // License Agreement Modal Handling
  const licenseLink = document.getElementById("licenseLink");
  const licenseModal = document.getElementById("licenseModal");
  const closeLicenseModal = document.querySelector(".close-license");
  const closeLicenseBtn = document.querySelector(".close-license-btn");

  if (licenseLink && licenseModal) {
    licenseLink.addEventListener("click", (e) => {
      e.preventDefault();
      licenseModal.style.display = "block";
      document.body.style.overflow = "hidden";
    });

    const closeLicModal = () => {
      licenseModal.style.display = "none";
      document.body.style.overflow = "auto";
    };

    if (closeLicenseModal) {
      closeLicenseModal.addEventListener("click", closeLicModal);
    }

    if (closeLicenseBtn) {
      closeLicenseBtn.addEventListener("click", closeLicModal);
    }

    window.addEventListener("click", (e) => {
      if (e.target == licenseModal) {
        closeLicModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && licenseModal.style.display === "block") {
        closeLicModal();
      }
    });
  }
  // Testimonials Carousel (Auto-Play Infinite Loop)
  const carouselContainer = document.querySelector(".testimonials-carousel");
  if (carouselContainer) {
    const track = carouselContainer.querySelector(".testimonials-track");
    const cards = Array.from(track.querySelectorAll(".testimonial-card"));
    const prevBtn = carouselContainer.querySelector(".prev");
    const nextBtn = carouselContainer.querySelector(".next");
    const dotsContainer = carouselContainer.querySelector(".carousel-dots");

    // RTL Detection
    const isRTL = document.documentElement.dir === "rtl";

    // Configuration
    const gap = 30; // Must match CSS
    const autoPlayDelay = 3000; // 3 seconds
    let autoPlayTimer;
    let isTransitioning = false;
    let cardsPerView = 3;

    // Determine cards per view based on CSS breakpoints
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        cardsPerView = 1;
      } else if (window.innerWidth <= 1024) {
        cardsPerView = 2;
      } else {
        cardsPerView = 3;
      }
    };
    updateCardsPerView();

    // 1. Create Clones for Infinite Loop
    const clonesCount = 3; // Number of clones at each end

    // Clone for start (Prepend) - These will appear "before" the first item (Right side in RTL)
    // Clone selection: The *last* items match the *first* visible slots if we scroll backwards
    // Actually, simply cloning the last N items to the front
    for (let i = 0; i < clonesCount; i++) {
      const clone = cards[cards.length - 1 - i].cloneNode(true);
      clone.classList.add("clone");
      track.prepend(clone);
    }

    // Clone for end (Append)
    for (let i = 0; i < clonesCount; i++) {
      const clone = cards[i].cloneNode(true);
      clone.classList.add("clone");
      track.appendChild(clone);
    }

    // 2. Initialize Position
    let currentIndex = clonesCount;

    const getSlideWidth = () => {
      const card = track.querySelector(".testimonial-card");
      if (!card) return 0;
      const rect = card.getBoundingClientRect();
      return rect.width + gap;
    };

    const updateTrackPosition = (transition = true) => {
      const slideWidth = getSlideWidth();
      // In RTL, "Next" items are to the Left (negative direction physically from start).
      // However, the Track starts at the Right edge of the container.
      // Clones (Prepend) are to the Right of the Start?
      // Wait, Prepend adds before the firstChild.
      // In RTL Flexbox: First Child is Rightmost.
      // So Prepend adds to the Right of the First Child.
      // So the layout is: [ClonePrepend 3][ClonePrepend 2][ClonePrepend 1][Real 1][Real 2]...
      // (Right ----> Left)
      // Visual Viewport starts aligned with... ?
      // Flex container usually clips to the "Start".
      // So Viewport sees [ClonePrepend 3][ClonePrepend 2][ClonePrepend 1].
      // We want to see [Real 1].
      // [Real 1] is to the LEFT of the Prepend Clones.
      // So we need to move the Track LEFT (Negative TranslateX) to reveal [Real 1].

      // Let's re-verify Standard RTL Behavior in Chrome:
      // translateX(-100px) moves element Left.
      // If content is [CP3][CP2][CP1][Real1]... and Viewport is at [CP3]...
      // Moving Track LEFT by 3 units puts [Real1] in Viewport.
      // So offset should be NEGATIVE?

      // But user reported "invisible".
      // If I used negative before and it was invisible...
      // Maybe the browser is placing the "Start" at the Left Edge even in RTL?
      // Or maybe `translateX` works differently?

      // To be absolutely robust, we use a multiplier.
      // If negative didn't work, we try positive.
      // But logic suggests Negative is correct for "Moving Camera Right" / "Moving Content Left".

      // Let's Try Positive: If I move Track RIGHT (+), I see what is to the Left of the Start? No.
      // Move Track RIGHT (+) -> Shows what is to the Left of the Start (overflow-left).
      // Wait. [Out of View Left] [Viewport] [Out of View Right]
      // Content: [CP3][CP2][CP1] [Real1]...
      // If aligned Right.
      // Viewport sees [CP3][...].
      // [Real1] is Left of Viewport.
      // To bring [Real1] into Viewport, we must shift the content RIGHT?
      //   [Real1] -> needs to go Right to be in Viewport.
      //   So Track must translate POSITIVE.

      // YES. In RTL, "Next" content is to the Left. To see it, we move the "Strip" to the Right so the "Left Content" enters the frame.
      // Update: It depends on where the transform origin is or coordinate system.
      // Let's assume POSITIVE is needed for RTL.

      const directionMultiplier = isRTL ? 1 : -1;
      const offset = currentIndex * slideWidth * directionMultiplier;

      track.style.transition = transition
        ? "transform 0.5s ease-in-out"
        : "none";
      track.style.transform = `translateX(${offset}px)`;
    };

    // Initial positioning
    setTimeout(() => {
      updateTrackPosition(false);
      track.style.opacity = 1; // Fade in track after positioning to prevent flash using CSS later if needed
    }, 50);

    // 3. Dots
    const createDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      cards.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.classList.add("carousel-dot");
        if (i === 0) dot.classList.add("active");

        dot.addEventListener("click", () => {
          const targetIndex = clonesCount + i;
          currentIndex = targetIndex;
          updateTrackPosition(true);
          updateActiveDot(i);
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    };

    const updateActiveDot = (realIndex) => {
      const dots = dotsContainer.querySelectorAll(".carousel-dot");
      dots.forEach((d) => d.classList.remove("active"));
      if (dots[realIndex]) dots[realIndex].classList.add("active");
    };

    createDots();

    // 4. Movement logic
    const nextSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateTrackPosition(true);
    };

    const prevSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updateTrackPosition(true);
    };

    track.addEventListener("transitionend", () => {
      isTransitioning = false;
      const totalReal = cards.length;

      // Handle Infinite Loop
      if (currentIndex >= totalReal + clonesCount) {
        currentIndex = clonesCount;
        updateTrackPosition(false);
      }
      if (currentIndex < clonesCount) {
        currentIndex = currentIndex + totalReal;
        updateTrackPosition(false);
      }

      let dotIndex = (currentIndex - clonesCount) % totalReal;
      if (dotIndex < 0) dotIndex += totalReal;
      updateActiveDot(dotIndex);
    });

    // 5. Auto Play
    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, autoPlayDelay);
    };

    const stopAutoPlay = () => {
      clearInterval(autoPlayTimer);
    };

    const resetAutoPlay = () => {
      stopAutoPlay();
      startAutoPlay();
    };

    startAutoPlay();

    // Controls
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        // In RTL, Next button (Left arrow) should go to "Next" item (visually Left item).
        // Logic `nextSlide` increases index.
        // Index++ -> moves offset further Positive -> Moves Track Right -> Shows Left Items.
        // Yes.
        nextSlide();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    track.addEventListener("mouseenter", stopAutoPlay);
    track.addEventListener("mouseleave", startAutoPlay);

    window.addEventListener("resize", () => {
      updateCardsPerView();
      updateTrackPosition(false);
    });
  }
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mainNav = document.getElementById("mainNav");
  const closeNavBtn = document.getElementById("closeNavBtn");
  const navOverlay = document.getElementById("navOverlay");
  const navLinks = mainNav ? mainNav.querySelectorAll("a") : [];

  const toggleMenu = () => {
    if (mainNav && navOverlay) {
      mainNav.classList.toggle("active");
      navOverlay.classList.toggle("active");
      document.body.style.overflow = mainNav.classList.contains("active")
        ? "hidden"
        : "auto";
    }
  };

  const closeMenu = () => {
    if (mainNav && navOverlay) {
      mainNav.classList.remove("active");
      navOverlay.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMenu);
  }

  if (closeNavBtn) {
    closeNavBtn.addEventListener("click", closeMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", closeMenu);
  }

  // Close menu when clicking a link
  if (navLinks.length > 0) {
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }
});
