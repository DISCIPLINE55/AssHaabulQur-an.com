document.addEventListener("DOMContentLoaded", function () {
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: "smooth",
                });
            }
        });
    });

    // Theme Toggle
    const toggleTheme = document.getElementById("toggleTheme");
    toggleTheme.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });

    // Load saved theme preference
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    // FAQ Toggle
    document.querySelectorAll(".faq-item h3").forEach((question) => {
        question.addEventListener("click", function () {
            this.parentElement.classList.toggle("open");
        });
    });

    // Contact Form Validation
    const form = document.querySelector(".contact form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Your message has been sent successfully!");
        form.reset();
    });

    // Scroll Animations
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("section-visible");
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));
});
