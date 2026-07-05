document.addEventListener("DOMContentLoaded", function () {
  const faqs = document.querySelectorAll(".one-service-one-FAQ");
  const perPage = 6;
  let currentPage = 1;
  const totalPages = Math.ceil(faqs.length / perPage);

  function showPage(page) {
    faqs.forEach((faq) => (faq.style.display = "none"));

    const start = (page - 1) * perPage;
    const end = start + perPage;
    for (let i = start; i < end && i < faqs.length; i++) {
      faqs[i].style.display = "block";
    }

    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;

      if (i === page) {
        // btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        currentPage = i;
        showPage(currentPage);
      });

      pagination.appendChild(btn);
    }
  }

  showPage(currentPage);
});
