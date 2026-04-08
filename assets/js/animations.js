/**
 * Iddu Website Animations System
 * Handles scroll reveals, efficiency tickers, and ambient effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal System
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Efficiency Ticker Logic
    const tickers = document.querySelectorAll('.ticker-value');
    
    const animateTicker = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
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
            }
        });
    }, { threshold: 0.5 });

    tickers.forEach(t => tickerObserver.observe(t));

    // 3. Floating Nav Transparency
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Parallax Mouse Effect for Hero Glows
    const glows = document.querySelectorAll('.ambient-glow');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        glows.forEach((glow, index) => {
            const speed = (index + 1) * 20;
            const moveX = (x - 0.5) * speed;
            const moveY = (y - 0.5) * speed;
            glow.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
});
