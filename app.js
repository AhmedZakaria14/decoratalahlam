document.addEventListener("DOMContentLoaded", () => {
  const current = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const target = link.getAttribute("href").split("/").pop();
    if (target === current) link.setAttribute("aria-current", "page");
  });

  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count || 0);
    let value = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const tick = () => {
      value += step;
      if (value >= target) {
        el.textContent = target.toLocaleString("en-US");
      } else {
        el.textContent = value.toLocaleString("en-US");
        requestAnimationFrame(tick);
      }
    };
    tick();
  });
});
