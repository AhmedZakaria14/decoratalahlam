const scrollBtn = document.getElementById("scrollBtn");
const temp3Header = document.getElementById("temp3-header");

const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

// إعداد طول stroke
circle.style.strokeDasharray = `${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  setProgress(scrollPercent);
}

// تحديث أثناء السكروول
window.addEventListener("scroll", updateScrollProgress);

// عند الضغط يرجع للـ Hero Section
scrollBtn.addEventListener("click", () => {
  temp3Header.scrollIntoView({ behavior: "smooth" });
});
