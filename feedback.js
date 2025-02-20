// Get elements
const feedbackBtn = document.getElementById("feedbackBtn");
const feedbackModal = document.getElementById("feedbackModal");
const closeModal = document.querySelector(".close");
const feedbackForm = document.getElementById("feedbackForm");
const confirmationMessage = document.getElementById("confirmationMessage");
const loadingMessage = document.getElementById("loadingMessage");

// Show modal when feedback button is clicked
feedbackBtn.addEventListener("click", () => {
    feedbackModal.style.display = "flex";
});

// Close modal when close button is clicked
closeModal.addEventListener("click", () => {
    feedbackModal.style.display = "none";
});

// Close modal when clicking outside the content
window.addEventListener("click", (e) => {
    if (e.target === feedbackModal) {
        feedbackModal.style.display = "none";
    }
});

// Handle form submission
feedbackForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Show loading message
    loadingMessage.style.display = "block";
    confirmationMessage.style.display = "none"; // Hide success message in case it's still visible

    const formData = new FormData(feedbackForm);

    try {
        const response = await fetch(feedbackForm.action, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json"
            }
        });

        setTimeout(() => {
            loadingMessage.style.display = "none"; // Hide loading message

            if (response.ok) {
                confirmationMessage.textContent = "✅ Feedback sent successfully!";
                confirmationMessage.style.display = "block";
                confirmationMessage.style.color = "green";
                feedbackForm.reset(); // Reset form fields
                
                // Redirect to homepage after 2 seconds
                setTimeout(() => {
                    window.location.href = "index.html"; // Change this to your homepage
                }, 2000);
            } else {
                confirmationMessage.textContent = "❌ Failed to send feedback. Try again.";
                confirmationMessage.style.display = "block";
                confirmationMessage.style.color = "red";
            }
        }, 5000); // Simulate loading for 5 seconds
    } catch (error) {
        loadingMessage.style.display = "none"; // Hide loading
        confirmationMessage.textContent = "⚠️ Network error. Please try again.";
        confirmationMessage.style.display = "block";
        confirmationMessage.style.color = "red";
    }
});
