const scrollBtn = document.getElementById("scrollBtn");

if (scrollBtn) {
    const circle = document.querySelector(".progress-ring__circle");
    let circumference = 0;

    if (circle) {
        const radius = circle.r.baseVal.value;
        circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;
    }

    function setProgress(percent) {
        if (circle) {
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }
    }

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (scrollTop > 300) {
            scrollBtn.style.display = "block";
            scrollBtn.style.opacity = "1";
        } else {
            scrollBtn.style.opacity = "0";
            setTimeout(() => {
                if (window.scrollY <= 300) scrollBtn.style.display = "none";
            }, 300);
        }

        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(scrollPercent);
        }
    }

    window.addEventListener("scroll", updateScrollProgress);
    
    // Initial check
    updateScrollProgress();

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
