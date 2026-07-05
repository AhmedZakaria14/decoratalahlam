const blogs_track = document.querySelector(".blogs-cards");
const blogs_slides = document.querySelectorAll(".blog-card");

let blogsCurrentIndex = 0;

function getBlogSlidesPerView() {
  if (window.innerWidth <= 767) return 1; // 📱 موبايل
  return 2; // 🖥️ ديسكتوب + تابلت
}

let blogs_slidesPerView = getBlogSlidesPerView();
const totalblogslides = blogs_slides.length;

// نعمل نسخة من أول X عناصر (حسب العرض)
function cloneBlogSlides() {
  for (let i = 0; i < blogs_slidesPerView; i++) {
    const clone = blogs_slides[i].cloneNode(true);
    blogs_track.appendChild(clone);
  }
}
cloneBlogSlides();

function showblogslide(index) {
  const offset = index * (100 / blogs_slidesPerView);
  blogs_track.style.transform = `translateX(${offset + 9}%)`;
}

function startblogslider() {
  setInterval(() => {
    moveNextSlideblogs();
  }, 5000);
}

function moveNextSlideblogs() {
  blogsCurrentIndex++;
  blogs_track.style.transition = "transform 1s ease-in-out";
  showblogslide(blogsCurrentIndex);

  if (blogsCurrentIndex === totalblogslides) {
    setTimeout(() => {
      blogs_track.style.transition = "none";
      blogsCurrentIndex = 0;
      showblogslide(blogsCurrentIndex);
    }, 1000);
  }
}

function movePrevSlideblogs() {
  blogsCurrentIndex--;
  if (blogsCurrentIndex < 0) {
    blogsCurrentIndex = totalblogslides - 1;
  }
  blogs_track.style.transition = "transform 1s ease-in-out";
  showblogslide(blogsCurrentIndex);
}

// ✅ Touch Events
let startXBlog = 0;
let endXBlog = 0;

blogs_track.addEventListener("touchstart", (e) => {
  startXBlog = e.touches[0].clientX;
});

blogs_track.addEventListener("touchend", (e) => {
  endXBlog = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipeblogs() {
  let diff = startXBlog - endXBlog;
  if (Math.abs(diff) > 50) {
    // لازم يكون في فرق واضح
    if (diff > 0) {
      movePrevSlideblogs(); // سحب لليمين → رجع للأول
    } else {
      moveNextSlideblogs(); // سحب لليسار → روح للبعده
    }
  }
}

startblogslider();

// ✅ تحديث عند تغيير حجم الشاشة
window.addEventListener("resize", () => {
  blogs_slidesPerView = getBlogSlidesPerView();
});
