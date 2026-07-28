document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalLink = document.getElementById("modal-link");

  modal.style.display = "none";

  const projects = document.querySelectorAll(".project");

  projects.forEach((project) => {
    project.addEventListener("click", function () {
      console.log("project", project);
      const imageSrc = this.getAttribute("data-src");
      const title = this.getAttribute("data-title");
      const description = this.getAttribute("data-desc");
      const link = this.getAttribute("data-link");

      modalImg.src = imageSrc;
      modalTitle.innerText = title;
      modalDesc.innerText = description;
      modalLink.href = link;
      modal.style.display = "flex"; //  المودال
    });
  });

  // قفل
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  function closeModal() {
    modal.style.display = "none";
  }

  document.querySelector(".close").addEventListener("click", closeModal);
});
