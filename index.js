document.querySelector('.get-started-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
});


const cards = document.querySelectorAll('.card');


const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      
        if (entry.isIntersecting) {
            
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);  
        }
    });
}, { threshold: 0.5 });  


cards.forEach(card => {
    observer.observe(card);
});

document.addEventListener("DOMContentLoaded", function () {
    const aboutSection = document.querySelector(".about-content");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutSection.classList.add("show"); 
            }
        });
    }, { threshold: 0.3 }); 

    observer.observe(aboutSection);
});

document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll(".counter");
    let started = false;

    function startCounting() {
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            let count = 0;

            function updateCount() {
                if (count < target) {
                    count++;
                    const countStr = count.toString();
                    if (countStr.length > 1) {
                        counter.innerHTML = countStr.slice(0, -1) + `<span class="last-digit">${countStr.slice(-1)}</span>+`;
                    } else {
                        counter.innerHTML = `<span class="last-digit">${countStr}</span>+`;
                    }

                    setTimeout(updateCount, 1000); 
                } else {
                    counter.innerHTML = `${target}+`; 
                }
            }
            updateCount();
        });
    }

    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                startCounting();
                started = true; 
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector(".stats-section"));
});

document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector(".testimonials-section");
    const wrapper = document.querySelector(".testimonials-wrapper");

    function startScroll() {
        if (section.getBoundingClientRect().top < window.innerHeight &&
            section.getBoundingClientRect().bottom > 0) {
            wrapper.classList.add("scrolling");
        }
    }

    window.addEventListener("scroll", startScroll);
});

document.addEventListener("DOMContentLoaded", function () {
    const contactSection = document.querySelector(".contact-section");

    function revealOnScroll() {
        const sectionPosition = contactSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (sectionPosition < screenPosition) {
            contactSection.classList.add("show");
        }
    }

    window.addEventListener("scroll", revealOnScroll);
});

document.getElementById("loginBtn").addEventListener("click", function () {
    window.location.href = "login.html";
});
