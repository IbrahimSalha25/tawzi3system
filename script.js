document.addEventListener("DOMContentLoaded", () => {
    // Reveal Animations using IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));

    // Stagger Animations for grids
    const staggerContainers = document.querySelectorAll('.stagger');
    
    staggerContainers.forEach(container => {
        const children = container.children;
        const staggerObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    Array.from(children).forEach((child, index) => {
                        // Setup start state dynamically to avoid initial CSS flicker
                        child.style.opacity = '0';
                        child.style.transform = 'translateY(25px)';
                        child.style.transition = `all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 0.15}s`;
                        
                        // Force reflow
                        void child.offsetWidth;
                        
                        // Trigger animation
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        staggerObserver.observe(container);
    });

    // Sticky Header Scroll
    const header = document.querySelector('.js-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if(window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Navigation
    const mobileBtn = document.querySelector('.js-mobile-btn');
    const nav = document.querySelector('.js-nav');
    
    if(mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            const isMenuOpen = nav.style.display === 'flex';
            if(isMenuOpen) {
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
                nav.style.borderTop = '1px solid rgba(0,0,0,0.05)';
                mobileBtn.innerHTML = '<i class="ph ph-x"></i>';
            }
        });

        // Close mobile nav when clicking a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if(window.innerWidth <= 900) {
                    nav.style.display = 'none';
                    mobileBtn.innerHTML = '<i class="ph ph-list"></i>';
                }
            });
        });
        
        // Handle resize properly
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                nav.style.display = 'flex';
                nav.style.flexDirection = 'row';
                nav.style.position = 'static';
                nav.style.boxShadow = 'none';
                nav.style.padding = '0';
                nav.style.background = 'transparent';
                nav.style.borderTop = 'none';
            } else {
                nav.style.display = 'none';
                mobileBtn.innerHTML = '<i class="ph ph-list"></i>';
            }
        });
    }

    // Smooth Scrolling for anchored links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // Offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });
});
