// Main JS for Fraylon Hosting

// FAQ Accordion Toggle
function toggleFaq(btn) {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    // Close all open items
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    // If it wasn't open, open it
    if (!isOpen) item.classList.add('open');
}


document.addEventListener('DOMContentLoaded', () => {
    // Countdown Timer
    const timerEl = document.getElementById('timer');
    let timeLeft = 12 * 3600 + 44 * 60 + 45; // 12H 44M 45S

    const updateTimer = () => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        timerEl.textContent = `${hours}H ${minutes}M ${seconds}S`;
        
        if (timeLeft > 0) {
            timeLeft--;
        } else {
            clearInterval(timerInterval);
            timerEl.textContent = "OFFER EXPIRED";
        }
    };

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();

    // Pricing Logic
    const pricingCards = document.querySelectorAll('.mw-pricing-card');

    const pricingData = {
        '48': [
            { price: 69, total: 3312, old: 399, discount: 83 },
            { price: 99, total: 4752, old: 499, discount: 80 },
            { price: 189, total: 9072, old: 599, discount: 68 },
            { price: 449, total: 21552, old: 1499, discount: 70 }
        ],
        '36': [
            { price: 89, total: 3204, old: 399, discount: 78 },
            { price: 119, total: 4284, old: 499, discount: 76 },
            { price: 209, total: 7524, old: 599, discount: 65 },
            { price: 499, total: 17964, old: 1499, discount: 67 }
        ],
        '24': [
            { price: 109, total: 2616, old: 399, discount: 73 },
            { price: 139, total: 3336, old: 499, discount: 72 },
            { price: 239, total: 5736, old: 599, discount: 60 },
            { price: 549, total: 13176, old: 1499, discount: 63 }
        ],
        '12': [
            { price: 129, total: 1548, old: 399, discount: 68 },
            { price: 159, total: 1908, old: 499, discount: 68 },
            { price: 269, total: 3228, old: 599, discount: 55 },
            { price: 599, total: 7188, old: 1499, discount: 60 }
        ]
    };

    const updatePricing = (selected) => {
        const data = pricingData[selected];
        pricingCards.forEach((card, index) => {
            const priceValueEl = card.querySelector('.price-value');
            const payTodayEl = card.querySelector('.pay-today');
            const oldPriceEl = card.querySelector('.old-price');
            const discountBadgeEl = card.querySelector('.badge-orange');
            
            if (priceValueEl) priceValueEl.textContent = data[index].price;
            if (payTodayEl) payTodayEl.textContent = `For ${selected} months, you pay ₹${data[index].total.toLocaleString()} today – no price increase.`;
            if (oldPriceEl) oldPriceEl.textContent = `₹${data[index].old}`;
            if (discountBadgeEl) discountBadgeEl.textContent = `${data[index].discount}% OFF`;
        });
    };

    // Global Show/Hide Features Logic (Toggles all plans at once)
    const toggleButtons = document.querySelectorAll('.see-all');
    const allExtraFeatures = document.querySelectorAll('.mw-extra-features');
    
    // Initial state setup for all
    allExtraFeatures.forEach(el => {
        el.style.maxHeight = '0';
        el.style.display = 'block';
    });

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check current state of any one plan (they are in sync)
            const isHidden = allExtraFeatures[0].style.maxHeight === '0px' || allExtraFeatures[0].style.maxHeight === '0';
            
            allExtraFeatures.forEach(extraFeatures => {
                if (isHidden) {
                    extraFeatures.style.maxHeight = '2000px';
                } else {
                    extraFeatures.style.maxHeight = '0';
                }
            });

            // Update text/icon for ALL buttons
            toggleButtons.forEach(btn => {
                if (isHidden) {
                    btn.innerHTML = 'Hide features <i class="fas fa-chevron-up"></i>';
                } else {
                    btn.innerHTML = 'Show features <i class="fas fa-chevron-down"></i>';
                }
            });
        });
    });

    // Accordion Toggle Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const subFeatures = header.nextElementSibling;
            const icon = header.querySelector('i');
            const isHidden = subFeatures.style.maxHeight === '0px' || subFeatures.style.maxHeight === '0' || !subFeatures.style.maxHeight;
            
            if (isHidden) {
                subFeatures.style.maxHeight = subFeatures.scrollHeight + 'px';
                icon.className = 'fas fa-minus';
            } else {
                subFeatures.style.maxHeight = '0';
                icon.className = 'fas fa-plus';
            }
        });
    });

    // Duration Dropdown Logic
    const durationDropdown = document.getElementById('durationDropdown');
    if (durationDropdown) {
        const dropdownSelected = durationDropdown.querySelector('.dropdown-selected');
        const dropdownOptions = durationDropdown.querySelectorAll('.option');
        const selectedLabel = durationDropdown.querySelector('.selected-text');

        dropdownSelected.addEventListener('click', (e) => {
            e.stopPropagation();
            durationDropdown.classList.toggle('active');
        });

        dropdownOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = option.getAttribute('data-value');
                const text = option.querySelector('span') ? option.querySelector('span').textContent : option.textContent.trim();
                
                selectedLabel.textContent = text;
                
                dropdownOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                durationDropdown.classList.remove('active');
                
                // Trigger global update if pricing depends on duration
                updatePricing(val);
                console.log('Selected Duration:', val);
            });
        });

        document.addEventListener('click', (e) => {
            if (!durationDropdown.contains(e.target)) {
                durationDropdown.classList.remove('active');
            }
        });
    }

    // ── Scroll-reveal (mw-reveal system) ──
    const revealTargets = document.querySelectorAll(
        '.mw-pricing-card, .guarantee-card, .testimonial-card, ' +
        '.why-feature-item, .why-grid-item, .faq-item, ' +
        '.support-card, .feature-card, .parallax-card, ' +
        '.mw-pricing-header, .mw-hero-text, .mw-hero-visual'
    );
    const delayClasses = ['', 'mw-reveal-d1', 'mw-reveal-d2', 'mw-reveal-d3'];
    revealTargets.forEach((el, i) => {
        el.classList.add('mw-reveal');
        const d = delayClasses[i % 4];
        if (d) el.classList.add(d);
    });
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('mw-visible');
                revealObserver.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    revealTargets.forEach(el => revealObserver.observe(el));

    // ── Sticky mobile CTA ──
    const stickyCta = document.getElementById('stickyCta');
    const heroSection = document.querySelector('.mw-hero');
    if (stickyCta && heroSection) {
        const stickyScroll = () => {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            if (heroBottom < 0) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', stickyScroll, { passive: true });
    }

    // Testimonial Slider Logic
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-nav .nav-btn:first-child');
    const nextBtn = document.querySelector('.slider-nav .nav-btn:last-child');
    let currentSlide = 0;

    const updateSlider = () => {
        const offset = currentSlide * -100;
        testimonialTrack.style.transform = `translateX(${offset}%)`;
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % testimonialCards.length;
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
            updateSlider();
        });
    }
});

