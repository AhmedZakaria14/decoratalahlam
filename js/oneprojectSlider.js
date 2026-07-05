document.addEventListener("DOMContentLoaded", () => {
  const mainImg = document.getElementById("projectMainImg");
  const track = document.querySelector(".gallerySlider .owl-stage");
  const imgs = document.querySelectorAll(".gallerySlider .img img");
  const prevBtn = document.querySelector(".gallerySlider .owl-prev");
  const nextBtn = document.querySelector(".gallerySlider .owl-next");

  let index = 0;

  // عند الضغط على أي صورة → تعرضها في الرئيسية
  imgs.forEach((img, i) => {
    img.addEventListener("click", () => {
      mainImg.innerHTML = ` <img src="${img.src}" alt="Main Image">`;
      document
        .querySelectorAll(".gallerySlider .img")
        .forEach((i) => i.classList.remove("active"));
      img.parentElement.classList.add("active");
      index = i; // تحديث الفهرس
    });
  });

  // حساب العرض الفعلي للصورة (مع الهامش)
  const slideWidth =
    document.querySelector(".gallerySlider .owl-item").offsetWidth + 10;

  // زر السابق (يمين)
  prevBtn.addEventListener("click", () => {
    index--;
    if (index < 0) index = imgs.length - 1; // لو أول صورة → يرجع لآخر صورة
    track.style.transform = `translateX(${(slideWidth * index) / 3}px)`;
    updateMainImage();
  });

  // زر التالي (يسار)
  nextBtn.addEventListener("click", () => {
    index++;
    if (index >= imgs.length) index = 0; // لو آخر صورة → يرجع لأول صورة
    track.style.transform = `translateX(${(slideWidth * index) / 3}px)`;
    updateMainImage();
  });

  // تحديث الصورة الرئيسية والـ active
  function updateMainImage() {
    const img = imgs[index];
    mainImg.innerHTML = `<img src="${img.src}" alt="Main Image">`;
    document
      .querySelectorAll(".gallerySlider .img")
      .forEach((i) => i.classList.remove("active"));
    img.parentElement.classList.add("active");
  }
});
