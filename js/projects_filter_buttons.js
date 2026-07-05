// ===============================================projects=================================================================

// Select buttons and projects
const filterButtons = document.querySelectorAll(".filters button");
const projects = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active-filter"));
    button.classList.add("active-filter");

    const filter = button.getAttribute("data-filter");

    projects.forEach((project) => {
      const category = project.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        project.classList.remove("hidden");
      } else {
        project.classList.add("hidden");
      }
    });
  });
});
