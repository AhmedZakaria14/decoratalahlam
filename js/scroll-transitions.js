/* ============================================================
   ديكورات الاحلام — تأثيرات التمرير والانتقالات الذكية
   Smooth Scroll Animations | Reveal Effects | Performance Optimized
   ============================================================ */

(function () {
  'use strict';

  // ── 1. نظام الكشف عند التمرير (Scroll Reveal System) ──
  function initScrollRevealSystem() {
    // العناصر المستهدفة للكشف
    const revealElements = document.querySelectorAll(
      '.temp3-about-us, .temp3-contact-us, .temp3-services-section, ' +
      '.testimonials, .temp3-counter-section, .blogs, ' +
      '.temp3-service-card, .card, .blog-card, .testimonial-card, ' +
      '.temp3-about-us-feature, h2, h3'
    );

    if (!('IntersectionObserver' in window)) {
      // fallback للمتصفحات القديمة
      revealElements.forEach(el => {
        el.classList.add('scroll-reveal', 'active');
      });
      return;
    }

    // إضافة فئة scroll-reveal للعناصر
    revealElements.forEach((el, index) => {
      if (!el.classList.contains('scroll-reveal')) {
        el.classList.add('scroll-reveal');
      }
      // تأخير متسلسل للعناصر
      el.style.transitionDelay = (index * 0.01) + 's';
    });

    // IntersectionObserver للكشف عند الظهور في viewport
    const observerOptions = {
      threshold: 0.01,
      rootMargin: '0px 0px 50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // إضافة فئة active عند الظهور
          entry.target.classList.add('active');
          // إلغاء المراقبة بعد الظهور
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // ── 2. تأثيرات الظهور من الجوانب ──
  function initSideRevealEffects() {
    const leftElements = document.querySelectorAll('.temp3-about-us-left, .reveal-left');
    const rightElements = document.querySelectorAll('.temp3-about-us-right, .reveal-right');

    if (!('IntersectionObserver' in window)) {
      leftElements.forEach(el => el.classList.add('scroll-reveal-left', 'active'));
      rightElements.forEach(el => el.classList.add('scroll-reveal-right', 'active'));
      return;
    }

    const observerOptions = {
      threshold: 0.015,
      rootMargin: '0px 0px 40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    leftElements.forEach(el => {
      if (!el.classList.contains('scroll-reveal-left')) {
        el.classList.add('scroll-reveal-left');
      }
      observer.observe(el);
    });

    rightElements.forEach(el => {
      if (!el.classList.contains('scroll-reveal-right')) {
        el.classList.add('scroll-reveal-right');
      }
      observer.observe(el);
    });
  }

  // ── 3. تأثيرات التكبير عند الظهور ──
  function initScaleRevealEffects() {
    const scaleElements = document.querySelectorAll(
      '.temp3-service-card, .card, .blog-card, .testimonial-card'
    );

    if (!('IntersectionObserver' in window)) {
      scaleElements.forEach(el => el.classList.add('scroll-reveal-scale', 'active'));
      return;
    }

    const observerOptions = {
      threshold: 0.01,
      rootMargin: '0px 0px 40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal-scale', 'active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scaleElements.forEach(el => observer.observe(el));
  }

  // ── 4. تأثيرات التلاشي البسيط ──
  function initFadeRevealEffects() {
    const fadeElements = document.querySelectorAll(
      'footer, .temp3-footer, .footer-section'
    );

    if (!('IntersectionObserver' in window)) {
      fadeElements.forEach(el => el.classList.add('scroll-reveal-fade', 'active'));
      return;
    }

    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-reveal-fade', 'active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
  }

  // ── 5. تأثيرات الصور عند التمرير ──
  function initImageScrollEffects() {
    const images = document.querySelectorAll(
      '.temp3-about-us-common-img-style, .temp3-service-img img, .gallery-img'
    );

    images.forEach(img => {
      // إضافة فئة للانتقال
      img.classList.add('image-hover-zoom');

      // تأثير parallax بسيط
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.08) rotate(1deg)';
      });

      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  }

  // ── 6. تأثيرات الانتقال للنافبار ──
  function initHeaderScrollEffects() {
    const header = document.getElementById('temp3-header');
    if (!header) return;

    let lastScrollY = 0;
    let ticking = false;

    const updateHeaderStyle = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeaderStyle);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── 7. تأثيرات الانتقال المتسلسل للعناصر ──
  function initStaggeredAnimations() {
    const staggerContainers = document.querySelectorAll(
      '.temp3-services-grid-container, .contact-cards, .reveal-stagger'
    );

    staggerContainers.forEach(container => {
      const children = container.querySelectorAll('> *');
      children.forEach((child, index) => {
        child.style.opacity = '0';
        child.style.animation = `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.04}s forwards`;
      });
    });
  }

  // ── 8. تأثيرات الانتقال للقوائم ──
  function initListItemTransitions() {
    const listItems = document.querySelectorAll(
      '.temp3-about-us-feature, .intro-list li, .service-list li'
    );

    listItems.forEach((item, index) => {
      item.classList.add('list-item');
      item.style.transitionDelay = (index * 0.01) + 's';

      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(8px)';
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0)';
      });
    });
  }

  // ── 9. تأثيرات الانتقال للأزرار ──
  function initButtonTransitions() {
    const buttons = document.querySelectorAll(
      '.btn, .temp3-contact-btn, .temp3-hero-contact-btn, button'
    );

    buttons.forEach(btn => {
      btn.classList.add('btn-transition');

      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-4px)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
      });

      btn.addEventListener('mousedown', () => {
        btn.style.transform = 'translateY(-2px)';
      });

      btn.addEventListener('mouseup', () => {
        btn.style.transform = 'translateY(-4px)';
      });
    });
  }

  // ── 10. تأثيرات الانتقال للروابط ──
  function initLinkTransitions() {
    const links = document.querySelectorAll('a:not(.btn):not([class*="contact"])');

    links.forEach(link => {
      link.classList.add('link-transition');

      link.addEventListener('mouseenter', () => {
        link.style.opacity = '0.7';
      });

      link.addEventListener('mouseleave', () => {
        link.style.opacity = '1';
      });
    });
  }

  // ── 11. تأثيرات الانتقال للخطوط ──
  function initLineAnimations() {
    const lines = document.querySelectorAll(
      '.temp3-about-us-long-line, .temp3-about-us-short-line, hr'
    );

    if (!('IntersectionObserver' in window)) {
      lines.forEach(line => line.classList.add('line-grow'));
      return;
    }

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-grow');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    lines.forEach(line => observer.observe(line));
  }

  // ── 12. تأثيرات الانتقال للعناوين ──
  function initHeadingTransitions() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headings.forEach((heading, index) => {
      heading.classList.add('heading-transition');
      heading.style.transitionDelay = (index * 0.01) + 's';
    });
  }

  // ── 13. تأثيرات الانتقال للفقرات ──
  function initParagraphTransitions() {
    const paragraphs = document.querySelectorAll('p, .temp3-about-us-intro');

    paragraphs.forEach((p, index) => {
      p.classList.add('paragraph-transition');
      p.style.transitionDelay = (index * 0.01) + 's';
    });
  }

  // ── 14. تأثيرات الانتقال السلس للتمرير ──
  function initSmoothScrolling() {
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

  // ── 15. تأثيرات الانتقال للنماذج ──
  function initFormTransitions() {
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      input.classList.add('form-input-transition');

      input.addEventListener('focus', () => {
        input.style.transform = 'scale(1.01)';
        input.style.boxShadow = '0 0 0 3px rgba(0, 0, 0, 0.1)';
      });

      input.addEventListener('blur', () => {
        input.style.transform = 'scale(1)';
        input.style.boxShadow = 'none';
      });
    });
  }

  // ── 16. تأثيرات الانتقال للعناصر المعطلة ──
  function initDisabledElementTransitions() {
    const disabledElements = document.querySelectorAll('[disabled]');

    disabledElements.forEach(el => {
      el.classList.add('disabled-transition');
    });
  }

  // ── 17. تأثيرات الانتقال للصور المتعددة (Gallery) ──
  function initGalleryTransitions() {
    const galleryItems = document.querySelectorAll(
      '.temp3-about-us-container-imgs img, .gallery-item'
    );

    galleryItems.forEach((item, index) => {
      item.classList.add('gallery-item');
      item.style.transitionDelay = (index * 0.1) + 's';
    });
  }

  // ── 18. مراقبة الأداء ──
  function monitorPerformance() {
    // تقليل التأثيرات على الأجهزة الضعيفة
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-duration-fast', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration-normal', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration-slow', '0.01ms');
    }

    // اكتشاف الاتصال البطيء
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.effectiveType === '4g') {
        // اتصال سريع - تفعيل جميع التأثيرات
      } else if (connection.effectiveType === '3g') {
        // اتصال متوسط - تقليل التأثيرات قليلاً
        document.documentElement.style.setProperty('--transition-duration-normal', '0.3s');
      } else {
        // اتصال بطيء - تقليل التأثيرات بشكل كبير
        document.documentElement.style.setProperty('--transition-duration-normal', '0.2s');
      }
    }
  }

  // ── 19. تهيئة جميع التأثيرات ──
  function initAllTransitions() {
    // التحقق من دعم المتصفح
    if (!('IntersectionObserver' in window) && !('requestAnimationFrame' in window)) {
      console.warn('المتصفح لا يدعم الميزات المتقدمة');
      return;
    }

    // تهيئة جميع التأثيرات
    initScrollRevealSystem();
    initSideRevealEffects();
    initScaleRevealEffects();
    initFadeRevealEffects();
    initImageScrollEffects();
    initHeaderScrollEffects();
    initStaggeredAnimations();
    initListItemTransitions();
    initButtonTransitions();
    initLinkTransitions();
    initLineAnimations();
    initHeadingTransitions();
    initParagraphTransitions();
    initSmoothScrolling();
    initFormTransitions();
    initDisabledElementTransitions();
    initGalleryTransitions();
    monitorPerformance();

    // إضافة فئة loaded للـ body
    document.body.classList.add('transitions-loaded');
  }

  // ── تشغيل عند تحميل الصفحة ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllTransitions);
  } else {
    initAllTransitions();
  }

  // تصدير الدوال للاستخدام الخارجي
  window.scrollTransitions = {
    initScrollRevealSystem,
    initSideRevealEffects,
    initScaleRevealEffects,
    initFadeRevealEffects,
    initImageScrollEffects,
    initHeaderScrollEffects
  };
})();
