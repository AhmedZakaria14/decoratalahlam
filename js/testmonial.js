const testimonials_track = document.querySelector(".testimonials-cards");
const testimonials_slides = document.querySelectorAll(".testimonial-card");
let testimonialsCurrentIndex = 0;

function getSlidesPerView() {
  if (window.innerWidth <= 1014) return 1; // تابلت وموبايل
  return 2; // ديسكتوب
}

let testimonials_slidesPerView = getSlidesPerView();
const totaltestimonialslides = testimonials_slides.length;

// نعمل نسخة من أول X عناصر (حسب العرض)
function cloneSlides() {
  for (let i = 0; i < testimonials_slidesPerView; i++) {
    const clone = testimonials_slides[i].cloneNode(true);
    testimonials_track.appendChild(clone);
  }
}
cloneSlides();

function showtestimonialslide(index) {
  // ⚡ بدون السالب → السلايدر يمشي لليمين (زي ما انتِ عايزة)
  const offset = index * (100 / testimonials_slidesPerView);
  testimonials_track.style.transform = `translateX(${offset}%)`;
}

function moveNextSlidetestomonial() {
  testimonialsCurrentIndex++;
  testimonials_track.style.transition = "transform 1s ease-in-out";
  showtestimonialslide(testimonialsCurrentIndex);

  if (testimonialsCurrentIndex === totaltestimonialslides) {
    setTimeout(() => {
      testimonials_track.style.transition = "none";
      testimonialsCurrentIndex = 0;
      showtestimonialslide(testimonialsCurrentIndex);
    }, 1000);
  }
}

function movePrevSlidetestomonial() {
  testimonialsCurrentIndex--;
  if (testimonialsCurrentIndex < 0) {
    testimonialsCurrentIndex = totaltestimonialslides - 1;
  }
  testimonials_track.style.transition = "transform 1s ease-in-out";
  showtestimonialslide(testimonialsCurrentIndex);
}

function starttestimonialslider() {
  setInterval(() => {
    moveNextSlidetestomonial();
  }, 5000);
}
starttestimonialslider();

// ✅ دعم التتش (Swipe)
let startXtestomonial = 0;
let endXtestomonial = 0;

testimonials_track.addEventListener("touchstart", (e) => {
  startXtestomonial = e.touches[0].clientX;
});

testimonials_track.addEventListener("touchend", (e) => {
  endXtestomonial = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipetestomonial() {
  let difftestomonial = startXtestomonial - endXtestomonial;
  if (Math.abs(diff) > 50) {
    if (difftestomonial > 0) {
      movePrevSlidetestomonial(); // سحب لليمين → يرجع للخلف
    } else {
      moveNextSlidetestomonial(); // سحب لليسار → يروح لليمين
    }
  }
}

// ✅ تحديث عند تغيير حجم الشاشة
window.addEventListener("resize", () => {
  testimonials_slidesPerView = getSlidesPerView();
});
