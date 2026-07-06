/* ============================================================
   ديكورات الاحلام — ملف تحسينات JavaScript الشاملة
   Scroll Reveal | Lazy Images | Progress Bar | Mobile UX
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. شريط تقدم التمرير ── */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.prepend(bar);

    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── 2. إخفاء/إظهار الـ nav عند التمرير ── */
  function initSmartNav() {
    const nav = document.getElementById('temp3-nav');
    if (!nav) return;

    let lastY = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          if (currentY > 120 && currentY > lastY) {
            nav.classList.add('nav-hidden');
          } else {
            nav.classList.remove('nav-hidden');
          }
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ── 3. Scroll Reveal (IntersectionObserver) ── */
  function initScrollReveal() {
    // أضف classes لكل القطاعات
    const selectors = [
      '.temp3-about-us',
      '.temp3-contact-us',
      '.temp3-services-section',
      '.blogs',
      '.testimonials',
      '.temp3-counter-section',
      '.temp3-service-card',
      '.card',
      '.blog-card',
      '.testimonial-card',
      '.temp3-counter-card',
      '.temp3-about-us-feature',
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    elements.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.willChange = 'opacity, transform';
      // stagger delay for grid items
      const parent = el.parentElement;
      if (parent) {
        const siblings = [...parent.children];
        const idx = siblings.indexOf(el);
        if (idx > 0 && idx < 8) {
          el.style.transitionDelay = (idx * 0.03) + 's';
        }
      }
    });

    // about section — لف وضم
    const aboutLeft = document.querySelector('.temp3-about-us-left');
    const aboutRight = document.querySelector('.temp3-about-us-right');
    if (aboutLeft) { 
      aboutLeft.classList.remove('reveal'); 
      aboutLeft.classList.add('reveal-left'); 
      aboutLeft.style.willChange = 'opacity, transform';
    }
    if (aboutRight) { 
      aboutRight.classList.remove('reveal'); 
      aboutRight.classList.add('reveal-right'); 
      aboutRight.style.willChange = 'opacity, transform';
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.classList.add('visible');
          });
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '0px 0px 100px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach(el => observer.observe(el));
  }

  /* ── 4. Lazy image loading with fade-in ── */
  function initLazyImages() {
    const images = document.querySelectorAll('img');

    const loadImage = (img) => {
      if (img.complete && img.naturalHeight !== 0) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
        img.addEventListener('error', () => img.classList.add('loaded')); // still show on error
      }
    };

    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadImage(entry.target);
            imgObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px' });

      images.forEach(img => imgObserver.observe(img));
    } else {
      images.forEach(loadImage);
    }
  }

  /* ── 5. تحسين قائمة الجوال ── */
  function initMobileMenuUX() {
    const pagesBtn = document.getElementById('temp3-pages-btn');
    const overlay = document.getElementById('temp3-over-lay');
    const closeBtn = document.getElementById('temp3-close-btn');

    if (!pagesBtn || !overlay) return;

    const openMenu = () => {
      document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
      document.body.classList.remove('menu-open');
    };

    pagesBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // إغلاق عند النقر خارج القائمة
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeMenu();
    });

    // إغلاق عند الضغط على Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // إغلاق تلقائي عند النقر على رابط (للجوال)
    const navLinks = overlay.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ── 6. Ripple effect على الأزرار ── */
  function initRipple() {
    const buttons = document.querySelectorAll(
      '.temp3-hero-contact-btn, .hero-whatsapp-btn, .temp3-contact-btn, .card .btn, .blogs .btn, .testimonials .btn'
    );

    buttons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          transform: scale(0);
          animation: rippleAnim 0.6s linear;
          pointer-events: none;
          z-index: 10;
        `;

        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });
    });

    // inject keyframe once
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes rippleAnim {
          to { transform: scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* ── 7. تحسين تجربة لمس الخدمات (عرض الأزرار عند النقر في الجوال) ── */
  function initServiceCardTouch() {
    if (window.matchMedia('(hover: none)').matches) {
      const cards = document.querySelectorAll('.temp3-service-card');
      cards.forEach(card => {
        card.addEventListener('click', (e) => {
          // إذا لم ينقر على رابط مباشرة
          if (!e.target.closest('a')) {
            cards.forEach(c => c.classList.remove('touch-active'));
            card.classList.toggle('touch-active');
          }
        });
      });

      // style for touch-active
      const style = document.createElement('style');
      style.textContent = `
        .temp3-service-card.touch-active .temp3-service-ul-links {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .temp3-service-card.touch-active .temp3-service-img img {
          filter: brightness(0.7) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* ── 8. Counter animation enhancement ── */
  function enhanceCounter() {
    // يعمل مع counter.js الموجود، فقط يضيف easing
    const counterCards = document.querySelectorAll('.temp3-counter-card');
    counterCards.forEach((card, i) => {
      card.style.transitionDelay = (i * 0.12) + 's';
    });
  }

  /* ── 9. Smooth anchor scrolling ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── 10. Footer reveal text ── */
  function initFooterReveal() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    footer.classList.add('reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.05 });

    observer.observe(footer);
  }

  /* ── تهيئة كل شيء عند التحميل ── */
  function init() {
    initScrollProgress();
    initSmartNav();
    initLazyImages();
    initScrollReveal();
    initMobileMenuUX();
    initRipple();
    initServiceCardTouch();
    enhanceCounter();
    initSmoothScroll();
    initFooterReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
