document.addEventListener("DOMContentLoaded", function () {
    const emailForm = document.getElementById("email-form");
    const errorMessage = document.getElementById("error-message");

    emailForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        // Simulated user database (stored in localStorage for now)
        let users = JSON.parse(localStorage.getItem("users")) || {};

        if (users[email]) {
            if (users[email] === password) {
                localStorage.setItem("loggedInUser", email);
                alert("✅ Login Successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "index.html"; // Change to your main page
                }, 1000);
            } else {
                errorMessage.textContent = "❌ Incorrect password!";
                errorMessage.style.display = "block";
            }
        } else {
            // Register new user
            users[email] = password;
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("loggedInUser", email);
            alert("✅ Account Created! Redirecting...");
            setTimeout(() => {
                window.location.href = "index.html"; // Change to your main page
            }, 1000);
        }
    });

    // Social Login Placeholder Functions
    document.getElementById("google-login").addEventListener("click", function () {
        alert("Google login not implemented yet!");
    });

    document.getElementById("microsoft-login").addEventListener("click", function () {
        alert("Microsoft login not implemented yet!");
    });

    document.getElementById("github-login").addEventListener("click", function () {
        alert("GitHub login not implemented yet!");
    });

    document.getElementById("facebook-login").addEventListener("click", function () {
        alert("Facebook login not implemented yet!");
    });
});
