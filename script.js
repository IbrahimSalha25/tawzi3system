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
    ".feature-card, .hero-title, .hero-subtitle, .hero-buttons, .section-title, .vision-content, .audience-card, .impact-item, .support-card, .cta-item, .footer-col, .success-card",
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

  // ============================================
  // PROFESSIONAL TESTIMONIALS CAROUSEL
  // ============================================

  const track = document.getElementById("testimonialsTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const indicatorsContainer = document.getElementById("carouselIndicators");

  if (track && prevBtn && nextBtn && indicatorsContainer) {
    const cards = Array.from(track.querySelectorAll(".testimonial-card"));
    const isRTL = document.documentElement.dir === "rtl";

    // Configuration
    const gap = 30; // Must match CSS gap
    const autoPlayDelay = 5000; // 5 seconds
    let autoPlayTimer;
    let isTransitioning = false;
    let currentIndex = 0;
    let cardsPerView = 3; // Default desktop

    // Calculate cards per view based on window width
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        cardsPerView = 1;
      } else if (window.innerWidth <= 1024) {
        cardsPerView = 2;
      } else {
        cardsPerView = 3;
      }
    };

    // Clone cards for infinite loop effect
    const cloneCount = cardsPerView;

    // Clone last cards and prepend
    for (let i = cards.length - 1; i >= cards.length - cloneCount; i--) {
      const clone = cards[i].cloneNode(true);
      clone.classList.add("clone");
      track.prepend(clone);
    }

    // Clone first cards and append
    for (let i = 0; i < cloneCount; i++) {
      const clone = cards[i].cloneNode(true);
      clone.classList.add("clone");
      track.appendChild(clone);
    }

    // Initialize position
    currentIndex = cloneCount;

    // Calculate slide width (card width + gap)
    const getSlideWidth = () => {
      const card = track.querySelector(".testimonial-card");
      if (!card) return 0;
      return card.getBoundingClientRect().width + gap;
    };

    // Update track position
    const updateTrackPosition = (animate = true) => {
      const slideWidth = getSlideWidth();
      // RTL: positive offset moves track right, negative moves left
      // In RTL, "next" content is to the left, so we need positive offset
      const direction = isRTL ? 1 : -1;
      const offset = currentIndex * slideWidth * direction;

      track.style.transition = animate
        ? "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
        : "none";
      track.style.transform = `translateX(${offset}px)`;
    };

    // Create indicator dots
    const createIndicators = () => {
      indicatorsContainer.innerHTML = "";
      for (let i = 0; i < cards.length; i++) {
        const dot = document.createElement("button");
        dot.classList.add("carousel-indicator");
        dot.setAttribute("aria-label", `الانتقال إلى الشهادة ${i + 1}`);
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
          currentIndex = cloneCount + i;
          updateTrackPosition();
          updateIndicators(i);
          resetAutoPlay();
        });
        indicatorsContainer.appendChild(dot);
      }
    };

    // Update active indicator
    const updateIndicators = (index) => {
      const dots = indicatorsContainer.querySelectorAll(".carousel-indicator");
      dots.forEach((d) => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    };

    // Navigate to next slide
    const nextSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateTrackPosition();
    };

    // Navigate to previous slide
    const prevSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updateTrackPosition();
    };

    // Handle transition end (for infinite loop)
    track.addEventListener("transitionend", () => {
      isTransitioning = false;
      const totalCards = cards.length;

      // If we're past the last real card, jump to first
      if (currentIndex >= totalCards + cloneCount) {
        currentIndex = cloneCount;
        updateTrackPosition(false);
      }

      // If we're before the first real card, jump to last
      if (currentIndex < cloneCount) {
        currentIndex = cloneCount + totalCards - cardsPerView;
        updateTrackPosition(false);
      }

      // Update indicator to match current card
      let indicatorIndex = (currentIndex - cloneCount) % totalCards;
      if (indicatorIndex < 0) indicatorIndex += totalCards;
      updateIndicators(indicatorIndex);
    });

    // Auto-play functionality
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

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      },
      { passive: true },
    );

    track.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
      },
      { passive: true },
    );

    const handleSwipe = () => {
      const threshold = 50;
      const swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance > 0) {
          // Swipe left
          if (isRTL) {
            prevSlide();
          } else {
            nextSlide();
          }
        } else {
          // Swipe right
          if (isRTL) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }
    };

    // Button click handlers
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoPlay();
    });

    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoPlay();
    });

    // Pause on hover
    track.addEventListener("mouseenter", stopAutoPlay);
    track.addEventListener("mouseleave", startAutoPlay);

    // Handle window resize
    window.addEventListener("resize", () => {
      updateCardsPerView();
      updateTrackPosition(false);
    });

    // Initialize
    updateCardsPerView();
    createIndicators();
    setTimeout(() => {
      updateTrackPosition(false);
      startAutoPlay();
    }, 100);
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
