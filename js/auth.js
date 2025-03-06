document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const logoutBtn = document.getElementById("logout");

    // Registration Logic
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("register-email").value.trim();
            const password = document.getElementById("register-password").value.trim();

            let users = JSON.parse(localStorage.getItem("users")) || {};
            if (users[email]) {
                alert("Email already registered!");
            } else {
                users[email] = password;
                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem("loggedInUser", email);
                alert("Account created! Redirecting...");
                window.location.href = "index.html";
            }
        });
    }

    // Login Logic
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            let users = JSON.parse(localStorage.getItem("users")) || {};
            if (users[email] && users[email] === password) {
                localStorage.setItem("loggedInUser", email);
                alert("Login successful! Redirecting...");
                window.location.href = "index.html";
            } else {
                alert("Invalid credentials!");
            }
        });
    }

    // Dashboard Logic
    if (document.getElementById("user-email")) {
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (!loggedInUser) {
            window.location.href = "login.html";
        } else {
            document.getElementById("user-email").textContent = loggedInUser;
        }
    }

    // Logout Logic
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser");
            alert("Logged out!");
            window.location.href = "login.html";
        });
    }
});
