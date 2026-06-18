document.addEventListener("DOMContentLoaded", function () {
  let temp3Header = document.getElementById("temp3-header");
  let temp3nav = document.getElementById("temp3-nav");
  window.addEventListener("scroll", function () {
    let currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > 20) {
      temp3Header.style.backgroundColor = "white";
      temp3Header.style.borderBottomRightRadius = "10px";
      temp3Header.style.boxShadow = "0px 6px 8px rgba(189, 188, 188, 0.514)";
      temp3Header.style.borderBottomLeftRadius = "10px";
      temp3nav.style.backgroundColor = "white";
    } else {
      temp3Header.style.backgroundColor = "#f8fafd";
      temp3Header.style.borderBottomRightRadius = "0px";
      temp3Header.style.borderBottomLeftRadius = "0px";
      temp3nav.style.backgroundColor = "#f8fafd";
      temp3Header.style.boxShadow = "none";
    }
  });
});
