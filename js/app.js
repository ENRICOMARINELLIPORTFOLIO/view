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
    
    // Parse query params if any (e.g. #contatti?success=true)
    let cleanHash = hash;
    if (hash.includes('?')) {
        cleanHash = hash.split('?')[0];
    }
    
    if (cleanHash && validSections.includes(cleanHash)) {
        navigateTo(cleanHash);
    }

    // Handle back/forward browser navigation
    window.addEventListener('hashchange', () => {
        const currentHash = window.location.hash.replace('#', '');
        let cleanCurrentHash = currentHash;
        if (currentHash.includes('?')) {
            cleanCurrentHash = currentHash.split('?')[0];
        }
        if (cleanCurrentHash && validSections.includes(cleanCurrentHash)) {
            navigateTo(cleanCurrentHash, false); // false to avoid recursive hash updating
        } else if (!cleanCurrentHash) {
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

    // 1. Dynamically configure redirect URL based on current host environment (local vs production)
    const nextInput = document.getElementById('form-next');
    if (nextInput) {
        nextInput.value = window.location.origin + window.location.pathname + '#contatti?success=true';
    }

    // 2. Validate email format on submit and allow natural form POST
    form.addEventListener('submit', (e) => {
        const emailInput = document.getElementById('form-email');
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            e.preventDefault(); // Stop submission
            statusDiv.textContent = "Per favore, inserisci un indirizzo email valido (es. nome@esempio.com) per consentirmi di risponderti.";
            statusDiv.className = 'form-status error';
            statusDiv.classList.remove('hidden');
            return;
        }

        // Show sending state
        submitBtn.disabled = true;
        spinner.classList.remove('hidden');
        statusDiv.className = 'form-status hidden';
        statusDiv.textContent = '';
    });

    // 3. Display success message if redirected back with success parameter
    if (window.location.hash.includes('success=true')) {
        statusDiv.textContent = "Grazie! Il tuo messaggio è stato inviato correttamente. Riceverai a breve una copia dell'invio nella tua casella di posta.";
        statusDiv.className = 'form-status success';
        statusDiv.classList.remove('hidden');
        
        // Clean up hash in address bar silently
        history.replaceState(null, null, '#contatti');
    }
}

/**
 * 5. Security Preventions (Block image and file downloads)
 */
function initSecurityPreventions() {
    // Prevent right-click globally except inside the footer
    document.addEventListener('contextmenu', (e) => {
        if (!e.target.closest('.footer')) {
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
