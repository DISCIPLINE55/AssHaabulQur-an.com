document.addEventListener("DOMContentLoaded", function () {
    const feedbackBtn = document.getElementById("ctaFeedbackBtn");
    const feedbackModal = document.getElementById("feedbackModal");
    const closeBtn = document.querySelector(".close");
    const feedbackForm = document.getElementById("feedbackForm");
    const loadingMessage = document.getElementById("loadingMessage");
    const confirmationMessage = document.getElementById("confirmationMessage");

    // Set Button Text
    feedbackBtn.textContent = "Give Feedback";

    // Show Modal
    feedbackBtn.addEventListener("click", function () {
        feedbackModal.classList.add("show");
    });

    // Hide Modal
    closeBtn.addEventListener("click", function () {
        feedbackModal.classList.remove("show");
    });

    // Submit Form with Loading Effect
    feedbackForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Show loading message
        loadingMessage.style.display = "block";

        // Simulate form submission delay
        setTimeout(() => {
            loadingMessage.style.display = "none";
            confirmationMessage.textContent = "✅ Thank you for your feedback!";
            confirmationMessage.style.display = "block";

            // Reset form after a delay
            setTimeout(() => {
                feedbackForm.reset();
                feedbackModal.classList.remove("show");
                confirmationMessage.style.display = "none";
            }, 2000);
        }, 2000);
    });

    // Close modal when clicking outside content
    window.addEventListener("click", function (event) {
        if (event.target === feedbackModal) {
            feedbackModal.classList.remove("show");
        }
    });
});
