// Ensure DOM is loaded before running scripts
document.addEventListener("DOMContentLoaded", function () {
// REGISTER FORM HANDLING
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullName = document.getElementById("full-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        localStorage.setItem("user", JSON.stringify({ fullName, email, password }));
        alert("Registration successful! Redirecting to login...");
        window.location.href = "login.html";
    });
}

// LOGIN FORM HANDLING
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
            alert("Invalid credentials! Try again.");
            return;
        }

        alert("Login successful! Redirecting to the homepage...");
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html";
    });
}

// DASHBOARD PROFILE MANAGEMENT
const usernameDisplay = document.getElementById("username");
if (usernameDisplay) {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
        alert("No user found. Redirecting to login.");
        window.location.href = "login.html";
        return;
    }

    usernameDisplay.textContent = storedUser.fullName;
    document.getElementById("edit-name").value = storedUser.fullName;
    document.getElementById("edit-email").value = storedUser.email;

    const saveProfileBtn = document.getElementById("saveProfile");
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", function () {
            storedUser.fullName = document.getElementById("edit-name").value;
            storedUser.email = document.getElementById("edit-email").value;
            localStorage.setItem("user", JSON.stringify(storedUser));
            alert("Profile updated successfully!");
            usernameDisplay.textContent = storedUser.fullName;
        });
    }
}

// LOGOUT FUNCTIONALITY
const logoutBtn = document.querySelector(".logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("isLoggedIn");
        alert("Logged out successfully!");
        window.location.href = "login.html";
    });
}
});

document.addEventListener("DOMContentLoaded", function () {
    const text = "ASS-HAABUL-QURAN LIVE";
    const typingText = document.querySelector(".typing-text");
    
    let index = 0;

    function type() {
        if (index < text.length) {
            typingText.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 100);
        } else {
            typingText.style.borderRight = "none"; // Remove blinking cursor after typing
        }
    }

    type();
});

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector("#menuToggle");
        const navLinks = document.querySelector(".nav-links");
        const darkModeToggle = document.querySelector("#dark-mode-toggle");
        const body = document.body;

        // Mobile Menu Toggle
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

        // Dark Mode Toggle
        darkModeToggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            localStorage.setItem("dark-mode", body.classList.contains("dark-mode"));
        });

        // Load Dark Mode Preference
        if (localStorage.getItem("dark-mode") === "true") {
            body.classList.add("dark-mode");
        };
    });
           