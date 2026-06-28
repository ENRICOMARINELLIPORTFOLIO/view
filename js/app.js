/**
 * Enrico Marinelli Portfolio - Core JS Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initLightbox();
    initContactForm();
    initSecurityPreventions();
});

/**
 * 1. SPA Navigation Logic
 */
function initNavigation() {
    // Check if there is an active hash in the URL on load
    const hash = window.location.hash.replace('#', '');
    const validSections = ['home', 'ecommerce', 'cultural-heritage', 'social-carousel', 'yuka', 'brainrot', 'dorica', 'ai-engineering', 'contatti'];
    
    if (hash && validSections.includes(hash)) {
        navigateTo(hash);
    }

    // Handle back/forward browser navigation
    window.addEventListener('hashchange', () => {
        const currentHash = window.location.hash.replace('#', '');
        if (currentHash && validSections.includes(currentHash)) {
            navigateTo(currentHash, false); // false to avoid recursive hash updating
        } else if (!currentHash) {
            navigateTo('home', false);
        }
    });
}

function navigateTo(pageId, updateHash = true) {
    const sectionId = 'page-' + pageId;
    const targetSection = document.getElementById(sectionId);
    
    if (!targetSection) return;

    // 1. Hide all sections
    const allSections = document.querySelectorAll('.page-section');
    allSections.forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });

    // 2. Show target section
    targetSection.classList.remove('hidden');
    // Force reflow for animations to trigger correctly
    void targetSection.offsetWidth;
    targetSection.classList.add('active');

    // 3. Update active nav states (if needed)
    updateActiveNavLinks(pageId);

    // 4. Update hash in URL
    if (updateHash) {
        window.location.hash = pageId;
    }

    // 5. Scroll smoothly to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // 6. Close mobile menu if open
    const navLinks = document.getElementById('main-nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('open');
    }

    // 7. Close all dropdowns on navigation
    const dropdowns = document.querySelectorAll('.nav-item-dropdown');
    dropdowns.forEach(d => d.classList.remove('open-dropdown'));

    // 8. Dynamic footer CTA visibility
    const footerCta = document.getElementById('footer-cta');
    if (footerCta) {
        if (pageId === 'contatti') {
            footerCta.classList.add('hidden');
        } else {
            footerCta.classList.remove('hidden');
        }
    }
}

// Make navigateTo globally accessible
window.navigateTo = navigateTo;
function updateActiveNavLinks(pageId) {
    // Remove active styles from all links and dropdown parents
    const allLinks = document.querySelectorAll('.dropdown-link, #link-ai-engineering');
    allLinks.forEach(link => link.classList.remove('active-link'));
    
    const allDropdowns = document.querySelectorAll('.nav-item-dropdown');
    allDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active-indigo', 'active-purple', 'active-pink');
    });

    // 1. Highlight specific active link inside dropdown
    const activeLink = document.getElementById('link-' + pageId);
    if (activeLink) {
        activeLink.classList.add('active-link');
    }

    // 2. Find dropdown parent and add active class based on category
    const ecommerceLinks = ['ecommerce', 'cultural-heritage', 'social-carousel'];
    const researchLinks = ['yuka', 'brainrot', 'dorica'];
    const techLinks = ['ai-engineering'];

    if (ecommerceLinks.includes(pageId)) {
        if (allDropdowns[0]) allDropdowns[0].classList.add('active-indigo');
    } else if (researchLinks.includes(pageId)) {
        if (allDropdowns[1]) allDropdowns[1].classList.add('active-purple');
    } else if (techLinks.includes(pageId)) {
        if (allDropdowns[2]) allDropdowns[2].classList.add('active-pink');
    }
}

/**
 * 2. Mobile Menu / Hamburger Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('main-nav');
    const dropdowns = document.querySelectorAll('.nav-item-dropdown');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            mobileMenuBtn.classList.toggle('open');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        });
    }

    // Handle dropdown clicks on mobile devices (touch viewports)
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        
        trigger.addEventListener('click', (e) => {
            // Only toggle on mobile viewport
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();

                const isAlreadyOpen = dropdown.classList.contains('open-dropdown');
                
                // Close other dropdowns
                dropdowns.forEach(d => d.classList.remove('open-dropdown'));
                
                // Toggle current
                if (!isAlreadyOpen) {
                    dropdown.classList.add('open-dropdown');
                } else {
                    dropdown.classList.remove('open-dropdown');
                }
            }
        });
    });

    // Close dropdowns if clicking outside of header
    document.addEventListener('click', (e) => {
        const header = document.querySelector('.header-glass');
        if (!header.contains(e.target)) {
            dropdowns.forEach(d => d.classList.remove('open-dropdown'));
            if (navLinks && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('open');
            }
        }
    });
}

/**
 * 3. Lightbox Modal for Portfolio Images
 */
function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close-btn');
    
    if (!modal || !modalImg) return;

    const openLightbox = (src, alt) => {
        if (!src) return;
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        modalImg.src = src;
        captionText.textContent = alt || '';
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    };

    // Bind click to elements with class .lightbox-trigger
    const triggers = document.querySelectorAll('.lightbox-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLightbox(trigger.src, trigger.alt);
        });
    });

    // Also bind click to the container .showcase-image-container for a wider touch target
    const containers = document.querySelectorAll('.showcase-image-container');
    containers.forEach(container => {
        container.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const img = container.querySelector('img');
            if (img) {
                openLightbox(img.src, img.alt);
            }
        });
    });

    // Toggle zoom state inside Lightbox on image click
    modalImg.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Avoid closing lightbox on image click
        modalImg.classList.toggle('zoomed');
    });

    // Close functions
    const closeModal = () => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        modalImg.classList.remove('zoomed'); // Reset zoom state when closing
        document.body.style.overflow = ''; // Restore scroll
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === closeBtn) {
            closeModal();
        }
    });

    // Escape key listener to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

/**
 * 4. Contact Form Animation & Submission Handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('btn-submit-form');
    const spinner = document.getElementById('form-spinner');
    const statusDiv = document.getElementById('form-status');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page refresh

        // 1. Show loading state
        submitBtn.disabled = true;
        spinner.classList.remove('hidden');
        statusDiv.className = 'form-status hidden';
        statusDiv.textContent = '';

        // Get form inputs
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const subject = document.getElementById('form-subject').value;
        const message = document.getElementById('form-message').value;

        // 2. Real API Call to FormSubmit via AJAX
        fetch("https://formsubmit.co/ajax/enry91m@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                _subject: subject,
                message: message
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nell'invio del modulo");
            }
            return response.json();
        })
        .then(data => {
            // Hide spinner and re-enable button
            spinner.classList.add('hidden');
            submitBtn.disabled = false;

            // Show success message
            statusDiv.textContent = `Grazie ${name}! Il tuo messaggio è stato inviato correttamente. Enrico ti risponderà all'indirizzo ${email} al più presto.`;
            statusDiv.className = 'form-status success';
            statusDiv.classList.remove('hidden');

            // Reset Form Fields
            form.reset();
        })
        .catch(error => {
            // Hide spinner and re-enable button
            spinner.classList.add('hidden');
            submitBtn.disabled = false;

            // Show error message (do NOT show confirmation if submission failed)
            statusDiv.innerHTML = `Si è verificato un errore durante l'invio del messaggio. Ti invitiamo a riprovare più tardi o a scrivere direttamente a <a href="mailto:enry91m@gmail.com">enry91m@gmail.com</a>.`;
            statusDiv.className = 'form-status error';
            statusDiv.classList.remove('hidden');
            console.error("FormSubmit Error:", error);
        });
    });
}

/**
 * 5. Security Preventions (Block image and file downloads)
 */
function initSecurityPreventions() {
    // Prevent right-click on images, PDFs, and lightbox
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' || e.target.closest('a[href$=".pdf"]') || e.target.classList.contains('lightbox-content')) {
            e.preventDefault();
        }
    });

    // Prevent dragging images to copy them
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });
}
