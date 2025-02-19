document.querySelectorAll(".read-more").forEach((button) => {
    button.addEventListener("click", function (e) {
        e.preventDefault();
        let content = this.previousElementSibling; // Get the full content
        if (content.style.display === "block") {
            content.style.display = "none";
            this.textContent = "Read More";
        } else {
            content.style.display = "block";
            this.textContent = "Read Less";
        }
    });
});

