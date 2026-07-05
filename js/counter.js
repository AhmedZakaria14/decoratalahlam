function startCounter(counter) {
  const target = +counter.getAttribute("data-target");
  let count = 0;
  const increment = target / 500;

  const updateCount = () => {
    if (count < target) {
      count += increment;
      counter.innerText = Math.ceil(count);
      requestAnimationFrame(updateCount);
    } else {
      counter.innerText = target;
    }
  };

  updateCount();
}

const counters = document.querySelectorAll(".temp3-counter-card h3");
const options = { threshold: 0.5 };

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      startCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, options);

counters.forEach((counter) => {
  observer.observe(counter);
});
