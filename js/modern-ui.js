(() => {
  "use strict";

  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  onReady(() => {
    const header = document.querySelector("#temp3-header");
    const progress = document.createElement("div");
    progress.className = "modern-reading-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.append(progress);

    let framePending = false;
    const updateScrollState = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollRange =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const percentage = scrollRange > 0 ? (scrollTop / scrollRange) * 100 : 0;

      progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
      header?.classList.toggle("is-scrolled", scrollTop > 18);
      framePending = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!framePending) {
          window.requestAnimationFrame(updateScrollState);
          framePending = true;
        }
      },
      { passive: true },
    );
    updateScrollState();

    const galleryImages = document.querySelectorAll(".blog-image-gallery img");
    if (!galleryImages.length) {
      return;
    }

    const lightbox = document.createElement("div");
    lightbox.className = "modern-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "عرض الصورة بحجم كبير");
    lightbox.innerHTML = `
      <button class="modern-lightbox__close" type="button" aria-label="إغلاق الصورة">×</button>
      <div class="modern-lightbox__content">
        <img alt="">
        <p></p>
      </div>
    `;
    document.body.append(lightbox);

    const lightboxImage = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector("p");
    const closeButton = lightbox.querySelector(".modern-lightbox__close");
    let lastFocused = null;

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      lightbox.setAttribute("aria-hidden", "true");
      lastFocused?.focus();
    };

    const openLightbox = (image) => {
      const caption = image.closest("figure")?.querySelector("figcaption");
      lastFocused = image;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "";
      lightboxCaption.textContent = caption?.textContent?.trim() || image.alt || "";
      lightbox.classList.add("is-open");
      document.body.classList.add("lightbox-open");
      lightbox.removeAttribute("aria-hidden");
      closeButton.focus();
    };

    galleryImages.forEach((image) => {
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `تكبير الصورة: ${image.alt || "صورة من المشروع"}`);
      image.addEventListener("click", () => openLightbox(image));
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(image);
        }
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  });
})();
