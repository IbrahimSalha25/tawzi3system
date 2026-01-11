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

  // Testimonials Carousel (Infinite Loop)
  const carousel = document.querySelector(".testimonials-carousel");
  if (carousel) {
    const track = carousel.querySelector(".testimonials-track");
    let originalCards = Array.from(track.querySelectorAll(".testimonial-card"));
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    // Config
    const gap = 30; // Must match CSS
    let autoPlayInterval;
    let cardsPerView = 3;
    let currentIndex = 0; // Relative to the visible window of real cards
    let isTransitioning = false;
    let autoPlayTime = 10000;

    // Clone Cards for infinite loop
    const cloneCount = 3; // Number of clones at each end

    const setupClones = () => {
      // Remove existing clones if any (for resizing)
      const existingClones = track.querySelectorAll(".clone");
      existingClones.forEach((el) => el.remove());

      // Refresh originalCards list
      originalCards = Array.from(track.querySelectorAll(".testimonial-card"));

      // Add Clones to Start (End of list -> Start)
      for (let i = 0; i < cloneCount; i++) {
        const clone =
          originalCards[originalCards.length - 1 - i].cloneNode(true);
        clone.classList.add("clone");
        clone.classList.remove("active-card", "fade-in", "visible");
        track.prepend(clone);
      }

      // Add Clones to End (Start of list -> End)
      for (let i = 0; i < cloneCount; i++) {
        const clone = originalCards[i].cloneNode(true);
        clone.classList.add("clone");
        clone.classList.remove("active-card", "fade-in", "visible");
        track.appendChild(clone);
      }
    };

    // Calculate cards per view based on screen size
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        cardsPerView = 1;
      } else if (window.innerWidth <= 1024) {
        cardsPerView = 2;
      } else {
        cardsPerView = 3;
      }
    };

    // Create dots
    const createDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      originalCards.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.classList.add("carousel-dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
          goToSlide(i + cloneCount); // Jump to the real card index
          stopAutoPlay();
          startAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    };

    const updateActiveState = (realIndex) => {
      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll(".carousel-dot");
        dots.forEach((dot, index) => {
          dot.classList.toggle("active", index === realIndex);
        });
      }

      // Update active-card visual class
      // currentIndex is the index of the first visible card on the left
      const allCards = Array.from(track.querySelectorAll(".testimonial-card"));
      allCards.forEach((c) => c.classList.remove("active-card"));

      // In a 3-card view, the active one is the middle one.
      // If currentIndex = 0, we see cards [0, 1, 2]. Middle is 1.
      let centerOffset = 1;
      if (cardsPerView === 2) centerOffset = 0; // Or 1, depending on preference
      if (cardsPerView === 1) centerOffset = 0;

      const activeIndex = currentIndex + centerOffset;
      if (allCards[activeIndex]) {
        allCards[activeIndex].classList.add("active-card");
      }
    };

    const getCardWidth = () => {
      const card = track.querySelector(".testimonial-card");
      return card ? card.offsetWidth : 0;
    };

    const slideTo = (index, transition = true) => {
      const cardWidth = getCardWidth();
      currentIndex = index;
      const offset = -(currentIndex * (cardWidth + gap));

      track.style.transition = transition
        ? "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
        : "none";
      track.style.transform = `translateX(${offset}px)`;

      // Calculate 'Real' Index for dots
      let realIndex = 0;
      if (currentIndex < cloneCount) {
        // We are in the start clones (End of list)
        realIndex = originalCards.length - (cloneCount - currentIndex);
      } else if (currentIndex >= originalCards.length + cloneCount) {
        // We are in the end clones (Start of list)
        realIndex = currentIndex - (originalCards.length + cloneCount);
      } else {
        realIndex = currentIndex - cloneCount;
      }

      // Normalize realIndex just in case
      realIndex = (realIndex + originalCards.length) % originalCards.length;

      updateActiveState(realIndex);
    };

    const goToSlide = (index) => {
      slideTo(index, true);
    };

    const nextSlide = () => {
      if (isTransitioning) return;
      slideTo(currentIndex + 1);
    };

    const prevSlide = () => {
      if (isTransitioning) return;
      slideTo(currentIndex - 1);
    };

    // Handle Infinite Loop Jump
    track.addEventListener("transitionend", () => {
      const allCards = track.querySelectorAll(".testimonial-card");
      // Boundary Checks
      if (currentIndex >= originalCards.length + cloneCount) {
        // Reached end clones, jump to start real
        // Calculate equivalent index:
        // e.g. cloneCount=3, length=6. End starts at index 9.
        // If current is 9 (copy of index 0), jump to 3 (index 0 relative to full list)
        const jumpIndex = currentIndex - originalCards.length;
        slideTo(jumpIndex, false);
      } else if (currentIndex < cloneCount) {
        // Reached start clones, jump to end real
        // e.g. current is 2 (copy of last card). Jump to 2 + 6 = 8.
        const jumpIndex = currentIndex + originalCards.length;
        slideTo(jumpIndex, false);
      }
      isTransitioning = false;
    });

    track.addEventListener("transitionstart", () => {
      isTransitioning = true;
    });

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayInterval = setInterval(nextSlide, autoPlayTime);
    };

    const stopAutoPlay = () => {
      clearInterval(autoPlayInterval);
    };

    // Event listeners
    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
      });
    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
      });

    // Initialization
    const init = () => {
      updateCardsPerView();
      setupClones();
      createDots();
      // Start at real index 0 (which is at index `cloneCount` in the full list)
      slideTo(cloneCount, false);
      startAutoPlay();
    };

    window.addEventListener("resize", () => {
      updateCardsPerView();
      // Reset position logic roughly
      const cardWidth = getCardWidth();
      const offset = -(currentIndex * (cardWidth + gap));
      track.style.transition = "none";
      track.style.transform = `translateX(${offset}px)`;
    });

    // Touch support (Simple)
    let touchStartX = 0;
    let touchEndX = 0;
    carousel.addEventListener(
      "touchstart",
      (e) => (touchStartX = e.changedTouches[0].screenX),
      { passive: true }
    );
    carousel.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) nextSlide();
        else if (touchEndX - touchStartX > 50) prevSlide();
        stopAutoPlay();
        startAutoPlay();
      },
      { passive: true }
    );

    init();
  }
});
