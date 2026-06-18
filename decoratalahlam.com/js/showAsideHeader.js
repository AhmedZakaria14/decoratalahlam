document.addEventListener("DOMContentLoaded", function () {
  let temp3PagesBtn = document.getElementById("temp3-pages-btn");
  let temp3OverLay = document.getElementById("temp3-over-lay");
  let temp3CloseBtn = document.getElementById("temp3-close-btn");
  let temp3CloseBtnContainer = document.getElementById(
    "temp3-close-btn-container"
  );

  let temp3CloseBtnSpan = document.getElementById("temp3-close-btn-span");

  function showAsideHeaderFnc() {
    temp3OverLay.classList.toggle("open-aside-header");
    const isOpen = temp3OverLay.classList.contains("open-aside-header");
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  temp3PagesBtn.addEventListener("click", showAsideHeaderFnc);
  temp3CloseBtn.addEventListener("click", showAsideHeaderFnc);
  temp3CloseBtnContainer.addEventListener("click", showAsideHeaderFnc);

  //  Reset overlay on resize (desktop mode)
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1289) {
      temp3OverLay.classList.remove("open-aside-header");
      document.body.style.overflow = "";
    }
  });
});
