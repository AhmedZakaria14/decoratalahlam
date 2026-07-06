/* ============================================================
   ديكورات الاحلام — تحسينات تفاعلات الجوال
   Mobile UX Enhancements | Smooth Interaction | Performance
   ============================================================ */

(function () {
  'use strict';

  // ── 1. إصلاح ارتفاع viewport على الجوال (vH Fix) ──
  function fixViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }

  // ── 2. منع التمرير الخلفي عند فتح القائمة (Prevent Background Scroll) ──
  function initMenuScrollLock() {
    const pagesBtn = document.getElementById('temp3-pages-btn');
    const closeBtn = document.getElementById('temp3-close-btn');
    const overlay = document.getElementById('temp3-over-lay');

    if (!pagesBtn || !overlay) return;

    const lockScroll = () => {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    };

    const unlockScroll = () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };

    pagesBtn.addEventListener('click', lockScroll);
    if (closeBtn) closeBtn.addEventListener('click', unlockScroll);
    
    // إغلاق عند النقر خارج القائمة
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) unlockScroll();
    });
  }

  // ── 3. تحسين استجابة اللمس (Touch Response) ──
  function initTouchOptimizations() {
    const interactiveElements = document.querySelectorAll('a, button, .card, .temp3-service-card');

    interactiveElements.forEach(el => {
      el.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      }, { passive: true });

      el.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
      }, { passive: true });
    });
  }

  // ── 4. إصلاح مشاكل الـ Hover على الجوال ──
  function fixMobileHover() {
    // إزالة تأثيرات hover إذا كان الجهاز يدعم اللمس فقط
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('is-touch-device');
    }
  }

  // ── 5. تحسين التمرير السلس على الجوال ──
  function initMobileSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          // إغلاق القائمة إذا كانت مفتوحة
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ── 6. تهيئة جميع التحسينات ──
  function initAllMobileEnhancements() {
    fixViewportHeight();
    initMenuScrollLock();
    initTouchOptimizations();
    fixMobileHover();
    initMobileSmoothScroll();
  }

  // تشغيل عند تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllMobileEnhancements);
  } else {
    initAllMobileEnhancements();
  }
})();
