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
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll(
    ".feature-card, .hero-title, .hero-subtitle, .hero-buttons, .section-title, .vision-content, .audience-card, .impact-item, .support-card, .cta-item, .footer-col"
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
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';

      const formData = new FormData(contactForm);
      const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSec7SvDd2W0r6xPpRed4AIh1Nq4iBYKHxoSgma9jSlQYfzfew/formResponse";

      try {
        await fetch(GOOGLE_FORM_URL, {
          method: "POST",
          mode: "no-cors",
          body: formData,
        });

        // Since no-cors returns an opaque response, we assume success if no network error occurred.
        formMessage.innerText = "تم إرسال رسالتك بنجاح! شكراً للتواصل معنا.";
        formMessage.classList.add('success');
        formMessage.style.display = 'block';
        contactForm.reset();

      } catch (error) {
        console.error("Error submitting form:", error);
        formMessage.innerText = "عذراً، حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.";
        formMessage.classList.add('error');
        formMessage.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      }
    });
  }
});
