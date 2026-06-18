document.addEventListener("DOMContentLoaded", function () {
  let temp3ToggleMenu = document.getElementById("temp3-toggle-menu");
  let temp3Dropdown = document.getElementById("temp3-dropdown");
  let temp3DropdownMenu = document.getElementById("temp3-dropdown-menu");

  temp3ToggleMenu.addEventListener("click", function () {
    temp3ToggleMenu.classList.add("rotate");

    setTimeout(() => {
      if (temp3ToggleMenu.textContent === "+") {
        temp3ToggleMenu.textContent = "−";
      } else {
        temp3ToggleMenu.textContent = "+";
      }

      temp3ToggleMenu.classList.remove("rotate");
    }, 400);

    temp3DropdownMenu.classList.toggle("active-temp3-dropdown-menu");
  });
});
