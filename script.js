document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Navigation Menu Scroll Effect
       ========================================================================== */
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else if (!document.title.includes('Career Opportunities') && !document.title.includes('Sports & Athletics')) {
            // Only remove scrolled style if NOT on subpages (careers/sports pages are pre-scrolled/sticky for contrast)
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. Responsive Mobile Navigation Menu
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            // Prevent scrolling background when menu is open
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when links are clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================================================
       3. Scrollspy - Highlight active nav links on scroll (Only on index page)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const isHomepage = !document.title.includes('Career Opportunities') && !document.title.includes('Sports & Athletics');
    
    if (isHomepage) {
        window.addEventListener('scroll', () => {
            let scrollY = window.pageYOffset;
            
            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 120; // offset for header
                const sectionId = current.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    const activeLink = document.querySelector(`.nav-menu a[href='#${sectionId}']`);
                    if (activeLink) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        activeLink.classList.add('active');
                    }
                }
            });
        });
    }

    /* ==========================================================================
       4. Animated Stats Counter (Intersection Observer)
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1500; // 1.5 seconds animation duration
        const startTime = performance.now();
        
        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutQuad)
            const easeProgress = progress * (2 - progress);
            
            const currentVal = Math.floor(easeProgress * target);
            
            // Add formatting like '+' or '%' depending on layout context
            if (target === 1200) {
                el.textContent = currentVal.toLocaleString() + '+';
            } else if (target === 98) {
                el.textContent = currentVal + '%';
            } else if (target === 15) {
                el.textContent = '1:' + currentVal;
            } else {
                el.textContent = currentVal + '+';
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                // Ensure absolute final value is correct
                if (target === 1200) el.textContent = '1,200+';
                else if (target === 98) el.textContent = '98%';
                else if (target === 15) el.textContent = '15:1';
                else el.textContent = target + '+';
            }
        };
        
        requestAnimationFrame(updateCount);
    };

    const statsSection = document.querySelector('.stats-section');
    if (statsSection && statNumbers.length > 0) {
        let animated = false;
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    statNumbers.forEach(num => animateCounter(num));
                    animated = true; // Run animation once
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.25 // trigger when 25% of section is visible
        });
        
        statsObserver.observe(statsSection);
    }

    /* ==========================================================================
       5. Academics Tab Switcher
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Toggle buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Toggle panels
            tabPanels.forEach(panel => {
                if (panel.getAttribute('id') === targetTab) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    /* ==========================================================================
       6. Homepage Contact Form Validation
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Input Fields & Errors
            const nameInput = document.getElementById('name');
            const nameError = document.getElementById('nameError');
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            const gradeInput = document.getElementById('grade');
            const gradeError = document.getElementById('gradeError');
            const messageInput = document.getElementById('message');
            const messageError = document.getElementById('messageError');

            // 1. Name Validation
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('invalid');
                nameError.textContent = 'Name is required';
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('invalid');
            }

            // 2. Email Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                emailInput.parentElement.classList.add('invalid');
                emailError.textContent = 'Email address is required';
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('invalid');
                emailError.textContent = 'Please enter a valid email format';
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('invalid');
            }

            // 3. Grade Selection Validation
            if (!gradeInput.value) {
                gradeInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                gradeInput.parentElement.classList.remove('invalid');
            }

            // 4. Message Validation
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                messageInput.parentElement.classList.remove('invalid');
            }

            // If validation passes
            if (isValid) {
                // Submit Form (Simulation)
                showToast("Inquiry Submitted!", "We've received your query and will reply within 24 hours.");
                contactForm.reset();
            }
        });

        // Add real-time validation cleanup on input
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.parentElement.classList.contains('invalid')) {
                    input.parentElement.classList.remove('invalid');
                }
            });
            input.addEventListener('change', () => {
                if (input.parentElement.classList.contains('invalid')) {
                    input.parentElement.classList.remove('invalid');
                }
            });
        });
    }

    /* ==========================================================================
       7. Careers Page Form Validation & Custom Actions
       ========================================================================== */
    const careerForm = document.getElementById('careerForm');
    const applyButtons = document.querySelectorAll('.apply-btn');
    const positionSelect = document.getElementById('cposition');
    const resumeInput = document.getElementById('cresume');
    const fileLabelText = document.getElementById('fileLabelText');

    // Job apply button integration
    if (applyButtons.length > 0 && positionSelect) {
        applyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const jobTitle = btn.getAttribute('data-job');
                
                // Select matching option
                positionSelect.value = jobTitle;
                
                // Smooth scroll to application form
                const targetForm = document.getElementById('apply');
                if (targetForm) {
                    targetForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // Dynamic file upload label indicator
    if (resumeInput && fileLabelText) {
        resumeInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                fileLabelText.textContent = fileName;
                fileLabelText.style.color = 'var(--primary)';
                resumeInput.parentElement.classList.remove('invalid');
            } else {
                fileLabelText.textContent = "Choose PDF file...";
                fileLabelText.style.color = '';
            }
        });
    }

    // Career application submission handling
    if (careerForm) {
        careerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const cname = document.getElementById('cname');
            const cemail = document.getElementById('cemail');
            const cphone = document.getElementById('cphone');
            const cposition = document.getElementById('cposition');
            const cresume = document.getElementById('cresume');

            // Name
            if (!cname.value.trim()) {
                cname.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                cname.parentElement.classList.remove('invalid');
            }

            // Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!cemail.value.trim() || !emailRegex.test(cemail.value.trim())) {
                cemail.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                cemail.parentElement.classList.remove('invalid');
            }

            // Phone
            if (!cphone.value.trim()) {
                cphone.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                cphone.parentElement.classList.remove('invalid');
            }

            // Position
            if (!cposition.value) {
                cposition.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                cposition.parentElement.classList.remove('invalid');
            }

            // Resume file checking (must be PDF)
            if (cresume.files.length === 0) {
                cresume.parentElement.classList.add('invalid');
                isValid = false;
            } else {
                const file = cresume.files[0];
                if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
                    cresume.parentElement.classList.add('invalid');
                    document.getElementById('cresumeError').textContent = 'Only PDF resumes are supported';
                    isValid = false;
                } else {
                    cresume.parentElement.classList.remove('invalid');
                }
            }

            if (isValid) {
                showToast("Application Submitted!", "We've received your credentials and will reach out shortly.");
                careerForm.reset();
                if (fileLabelText) {
                    fileLabelText.textContent = "Choose PDF file...";
                    fileLabelText.style.color = '';
                }
            }
        });

        // Real-time error removal
        const cinputs = careerForm.querySelectorAll('input, select, textarea');
        cinputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.parentElement.classList.contains('invalid')) {
                    input.parentElement.classList.remove('invalid');
                }
            });
            input.addEventListener('change', () => {
                if (input.parentElement.classList.contains('invalid')) {
                    input.parentElement.classList.remove('invalid');
                }
            });
        });
    /* ==========================================================================
       8. Hero Image Slider/Carousel
       ========================================================================== */
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Changes image every 5 seconds
    }

    // Shared toast trigger function
    function showToast(titleText, descText) {
        if (toast) {
            const toastTitle = toast.querySelector('.toast-message h4');
            const toastDesc = toast.querySelector('.toast-message p');
            
            if (toastTitle && toastDesc) {
                toastTitle.textContent = titleText;
                toastDesc.textContent = descText;
            }
            
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    }
});
