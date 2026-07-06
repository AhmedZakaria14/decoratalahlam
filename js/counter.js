function startCounter(counter) {
  const target = +counter.getAttribute("data-target");
  let count = 0;
  const duration = 2000; // 2 seconds
  const startTime = performance.now();

  const updateCount = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    count = progress * target;
    
    counter.innerText = Math.ceil(count);

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      counter.innerText = target;
    }
  };

  requestAnimationFrame(updateCount);
}

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".temp3-counter-card h3");
  const options = { threshold: 0.1 };

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
});
