document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);
    revealElements.forEach(el => observer.observe(el));

    const staggerContainers = document.querySelectorAll('.stagger');
    staggerContainers.forEach(container => {
        const children = container.children;
        const staggerObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    Array.from(children).forEach((child, index) => {
                        child.style.opacity = '0';
                        child.style.transform = 'translateY(25px)';
                        child.style.transition = `all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 0.15}s`;
                        void child.offsetWidth;
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        staggerObserver.observe(container);
    });

    const header = document.querySelector('.js-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if(window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

    const mobileBtn = document.querySelector('.js-mobile-btn');
    const nav = document.querySelector('.js-nav');
    if(mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            if(nav.style.display === 'flex') {
                nav.style.display = 'none';
                mobileBtn.innerHTML = '<i class="ph ph-list"></i>';
            } else {
                nav.style.display = 'flex';
                nav.style.flexDirection = 'column';
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.left = '0';
                nav.style.width = '100%';
                nav.style.background = 'white';
                nav.style.padding = '1rem 2rem';
                nav.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                nav.style.gap = '1.5rem';
                mobileBtn.innerHTML = '<i class="ph ph-x"></i>';
            }
        });
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if(window.innerWidth <= 900) { nav.style.display = 'none'; mobileBtn.innerHTML = '<i class="ph ph-list"></i>'; }
            });
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) { nav.style.display='flex'; nav.style.flexDirection='row'; nav.style.position='static'; nav.style.boxShadow='none'; nav.style.padding='0'; nav.style.background='transparent'; } 
            else { nav.style.display='none'; mobileBtn.innerHTML='<i class="ph ph-list"></i>'; }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({ top: targetElement.getBoundingClientRect().top + window.pageYOffset - 80, behavior: "smooth" });
            }
        });
    });

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
        const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSec7SvDd2W0r6xPpRed4AIh1Nq4iBYKHxoSgma9jSlQYfzfew/formResponse";
        try {
          await fetch(GOOGLE_FORM_URL, { method: "POST", mode: "no-cors", body: formData });
          formMessage.innerText = "تم إرسال رسالتك بنجاح! شكراً للتواصل معنا.";
          formMessage.classList.add("success");
          formMessage.style.display = "block";
          contactForm.reset();
        } catch (error) {
          console.error("Error submitting form:", error);
          formMessage.innerText = "عذراً، حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.";
          formMessage.classList.add("error");
          formMessage.style.display = "block";
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      });
    }

    // Modal Handling
    const setupModal = (linkId, modalId, closeClasses) => {
        const link = document.getElementById(linkId);
        const modal = document.getElementById(modalId);
        if (link && modal) {
            link.addEventListener("click", (e) => { e.preventDefault(); modal.style.display = "block"; document.body.style.overflow = "hidden"; });
            const closeModal = () => { modal.style.display = "none"; document.body.style.overflow = "auto"; };
            closeClasses.forEach(cls => {
                const btn = document.querySelector(`.${cls}`);
                if (btn) btn.addEventListener("click", closeModal);
            });
            window.addEventListener("click", (e) => { if (e.target == modal) closeModal(); });
            window.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.style.display === "block") closeModal(); });
        }
    };

    setupModal("privacyLink", "privacyModal", ["close-modal", "close-modal-btn"]);
    setupModal("licenseLink", "licenseModal", ["close-license", "close-license-btn"]);
});
