// HAMBURGER
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
    });
});

// FADE-IN
const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
        if (el.isIntersecting) el.target.classList.add('visible');
    });
}, {threshold: 0.12});
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// SCROLL SPY
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const scrollSpy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => scrollSpy.observe(s));

// STAGGER DELAYS
document.querySelectorAll('.pricing-card').forEach((c, i) => {
    c.style.transitionDelay = `${i * 0.1}s`;
});
document.querySelectorAll('.feature-item').forEach((c, i) => {
    c.style.transitionDelay = `${i * 0.08}s`;
});

// CAROUSEL
function initCarousel(wrap) {
    const track = wrap.querySelector('.carousel-track');
    const origSlides = Array.from(wrap.querySelectorAll('.carousel-slide'));
    const n = origSlides.length;
    const dotsContainer = wrap.parentElement.querySelector('.carousel-dots');
    const desktopVisible = parseInt(wrap.dataset.visible || '3', 10);
    const visibleCount = () => window.innerWidth <= 768 ? 1 : desktopVisible;
    let current = 0;

    origSlides.forEach(s => track.appendChild(s.cloneNode(true)));

    function buildDots() {
        dotsContainer.innerHTML = '';
        const count = n - visibleCount() + 1;
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goTo(index, animate = true) {
        const allSlides = wrap.querySelectorAll('.carousel-slide');
        if (!animate) track.style.transition = 'none';
        current = index;
        const slideWidth = allSlides[0].getBoundingClientRect().width + 24;
        track.style.transform = `translateX(-${current * slideWidth}px)`;
        const dotCount = dotsContainer.children.length;
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current % dotCount);
        });
        if (!animate) {
            track.getBoundingClientRect();
            track.style.transition = '';
        }
    }

    buildDots();

    track.addEventListener('transitionend', () => {
        if (current >= n) goTo(current - n, false);
        else if (current < 0) goTo(current + n, false);
    });

    let autoplay = setInterval(() => goTo(current + 1), 3000);

    function resetAutoplay() {
        clearInterval(autoplay);
        autoplay = setInterval(() => goTo(current + 1), 3000);
    }

    wrap.querySelector('.carousel-prev').addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
    wrap.querySelector('.carousel-next').addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });
    dotsContainer.addEventListener('click', resetAutoplay);
    window.addEventListener('resize', () => { buildDots(); goTo(current, false); });
}

document.querySelectorAll('.carousel-wrap').forEach(initCarousel);
