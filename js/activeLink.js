document.addEventListener("DOMContentLoaded", function () {
  let currentLocation = window.location.href;

  let links = document.querySelectorAll("temp3-pages a");

  links.forEach((link) => {
    if (link == currentLocation) {
      link.classlist.add("active");
    }
  });
});
