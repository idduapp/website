/**
 * Iddu Website Animations System
 * Handles scroll reveals, staggered grids, efficiency tickers, and ambient effects.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Auto-stagger children in grid/list containers
    // Each child gets .reveal + an incremental transition-delay so items cascade in.
    const staggerConfigs = [
        { container: '.pain-grid',            child: '.pain-card',       step: 0.10 },
        { container: '.features-grid',        child: '.feature-box',     step: 0.10 },
        { container: '.persona-grid',         child: '.persona-card',    step: 0.12 },
        { container: '.pricing-grid',         child: '.pricing-card',    step: 0.14 },
        { container: '.pipeline-grid',        child: '.pipeline-step',   step: 0.12 },
        { container: '.ai-gallery-container', child: '.gallery-item',    step: 0.10 },
    ];

    staggerConfigs.forEach(({ container, child, step }) => {
        document.querySelectorAll(container).forEach(wrapper => {
            wrapper.querySelectorAll(child).forEach((el, i) => {
                el.classList.add('reveal');
                // Inline delay overrides any .reveal-delay-* class so stagger is always clean
                el.style.transitionDelay = `${i * step}s`;
            });
        });
    });

    // 2. Scroll Reveal Observer
    // Fires once per element (unobserve after activation) for performance.
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -48px 0px',
    });

    // Observe all .reveal elements (includes those just assigned by stagger logic above)
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Efficiency Ticker Logic
    const animateTicker = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        if (!target) return;
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target.toLocaleString();
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current).toLocaleString();
            }
        }, stepTime);
    };

    const tickerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateTicker(entry.target);
                tickerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.ticker-value').forEach(t => tickerObserver.observe(t));

    // 4. Floating Nav Transparency
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // 5. Typewriter effect — fires on any .typewriter-tagline element
    const makeTypewriter = (el) => {
        const fullText = el.textContent.trim();
        el.textContent = '';
        const cursor = document.createElement('span');
        cursor.className = 'type-cursor';
        el.appendChild(cursor);

        let fired = false;
        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !fired) {
                fired = true;
                obs.disconnect();
                let i = 0;
                const tick = () => {
                    if (i < fullText.length) {
                        el.insertBefore(document.createTextNode(fullText[i++]), cursor);
                        setTimeout(tick, 18);
                    } else {
                        setTimeout(() => cursor.classList.add('done'), 1200);
                    }
                };
                setTimeout(tick, 250);
            }
        }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
        obs.observe(el);
    };

    document.querySelectorAll('.typewriter-tagline').forEach(makeTypewriter);

    // 5. Parallax Mouse Effect for Hero Glows
    const glows = document.querySelectorAll('.ambient-glow');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        glows.forEach((glow, i) => {
            const speed = (i + 1) * 20;
            glow.style.transform = `translate(${(x - 0.5) * speed}px, ${(y - 0.5) * speed}px)`;
        });
    }, { passive: true });

});
