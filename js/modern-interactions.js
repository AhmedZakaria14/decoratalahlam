/* ============================================================
   ديكورات الاحلام — تفاعلات وتأثيرات حديثة
   Smooth Animations | Interactive Elements | Modern UX
   ============================================================ */

(function () {
  'use strict';

  // ── 1. تأثيرات الماوس المتقدمة ──
  function initMouseEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // تغيير حجم المؤشر عند الضغط على العناصر التفاعلية
    const interactiveElements = document.querySelectorAll('a, button, .btn, .temp3-contact-btn, .temp3-hero-contact-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
      });
    });
  }

  // ── 2. تأثير الموجة عند الضغط على الأزرار ──
  function initWaveEffect() {
    const buttons = document.querySelectorAll('.btn, .temp3-contact-btn, .temp3-hero-contact-btn, button');

    buttons.forEach(button => {
      button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
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
          background: rgba(255, 255, 255, 0.5);
          transform: scale(0);
          animation: waveRipple 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 10;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
      });
    });

    // إضافة keyframe للموجة
    if (!document.getElementById('wave-ripple-style')) {
      const style = document.createElement('style');
      style.id = 'wave-ripple-style';
      style.textContent = `
        @keyframes waveRipple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ── 3. تأثير الكشف (Reveal) عند التمرير ──
  function initScrollReveal() {
    const elements = document.querySelectorAll(
      '.temp3-about-us, .temp3-contact-us, .temp3-services-section, .blogs, .testimonials, ' +
      '.temp3-counter-section, .temp3-service-card, .card, .blog-card, .testimonial-card, ' +
      '.temp3-counter-card, .temp3-about-us-feature, footer'
    );

    elements.forEach((el, index) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (index * 0.05) + 's';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ── 4. تأثير الإضاءة عند الضغط ──
  function initGlowEffect() {
    const cards = document.querySelectorAll('.temp3-service-card, .card, .testimonial-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });
  }

  // ── 5. تحميل الصور بتأثير التلاشي ──
  function initLazyImageLoad() {
    const images = document.querySelectorAll('img');

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.6s ease-in-out';

          img.addEventListener('load', () => {
            img.style.opacity = '1';
          });

          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    images.forEach(img => imageObserver.observe(img));
  }

  // ── 6. شريط التقدم المتقدم ──
  function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #a67c52, #d4a574, #e8c4a0);
      z-index: 9999;
      width: 0%;
      transition: width 0.1s ease;
      box-shadow: 0 0 20px rgba(212, 165, 116, 0.5);
    `;
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // ── 7. تأثير الـ Parallax ──
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
      parallaxElements.forEach(el => {
        const speed = el.dataset.parallax || 0.5;
        const yPos = window.scrollY * speed;
        el.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // ── 8. تأثير الـ Counter (عداد الأرقام) ──
  function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          const target = entry.target;
          const finalValue = parseInt(target.dataset.count);
          const duration = 2000; // 2 ثانية
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(finalValue * progress);

            target.textContent = currentValue;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              target.textContent = finalValue;
              target.classList.add('counted');
            }
          };

          animate();
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  // ── 9. تأثير التوهج على الأزرار ──
  function initButtonGlow() {
    const buttons = document.querySelectorAll('.btn, .temp3-contact-btn, .temp3-hero-contact-btn');

    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.boxShadow = '0 0 30px rgba(212, 165, 116, 0.6), 0 0 60px rgba(212, 165, 116, 0.3)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.boxShadow = '';
      });
    });
  }

  // ── 10. تأثير الـ Smooth Scroll ──
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ── 11. تأثير الـ Fade In للعناصر ──
  function initFadeInElements() {
    const elements = document.querySelectorAll('h1, h2, h3, p, .intro-list li');

    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
    });

    // إضافة keyframe للتلاشي
    if (!document.getElementById('fade-in-style')) {
      const style = document.createElement('style');
      style.id = 'fade-in-style';
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ── 12. تأثير الـ Hover على الصور ──
  function initImageHoverEffect() {
    const images = document.querySelectorAll('.temp3-service-img img, .temp3-about-us-common-img-style');

    images.forEach(img => {
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1) rotate(1deg)';
      });

      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  }

  // ── 13. تأثير النافبار الذكي ──
  function initSmartNavbar() {
    const header = document.getElementById('temp3-header');
    if (!header) return;

    let lastScrollY = 0;
    let isScrolling = false;

    window.addEventListener('scroll', () => {
      if (!isScrolling) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
          } else {
            header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.3)';
          }

          lastScrollY = currentScrollY;
          isScrolling = false;
        });
        isScrolling = true;
      }
    });
  }

  // ── 14. تأثير الـ Typing للنصوص ──
  function initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');

    typingElements.forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      let index = 0;

      const typeChar = () => {
        if (index < text.length) {
          el.textContent += text[index];
          index++;
          setTimeout(typeChar, 50);
        }
      };

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && index === 0) {
          typeChar();
        }
      });

      observer.observe(el);
    });
  }

  // ── 15. تأثير الـ Stagger Animation ──
  function initStaggerAnimation() {
    const containers = document.querySelectorAll('[data-stagger]');

    containers.forEach(container => {
      const children = container.children;
      Array.from(children).forEach((child, index) => {
        child.style.animation = `fadeInUp 0.6s ease-out ${index * 0.12}s forwards`;
        child.style.opacity = '0';
      });
    });
  }

  // ── تهيئة جميع التأثيرات ──
  function init() {
    // التحقق من دعم الميزات
    if ('IntersectionObserver' in window) {
      initScrollReveal();
      initLazyImageLoad();
      initCounterAnimation();
    }

    initMouseEffects();
    initWaveEffect();
    initGlowEffect();
    initProgressBar();
    initParallax();
    initButtonGlow();
    initSmoothScroll();
    initFadeInElements();
    initImageHoverEffect();
    initSmartNavbar();
    initTypingEffect();
    initStaggerAnimation();
  }

  // تشغيل عند تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
