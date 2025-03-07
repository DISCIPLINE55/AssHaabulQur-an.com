document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".enroll-btn").forEach(button => {
        button.addEventListener("click", function () {
            const courseName = this.parentElement.id;
            enrollCourse(courseName);
        });
    });
});

function enrollCourse(courseName) {
    let enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses")) || [];

    if (!enrolledCourses.includes(courseName)) {
        if (courseName === "tajweed") {
            let level = prompt("Choose your Tajweed level: Beginner, Intermediate, or Advanced").trim();
            level = formatLevel(level);

            if (!["Beginner", "Intermediate", "Advanced"].includes(level)) {
                alert("⚠️ Invalid level. Please select again.");
                return;
            }

            localStorage.setItem("tajweedLevel", level);
        }

        enrolledCourses.push(courseName);
        localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));

        alert(`✅ Successfully enrolled in ${courseName}! Redirecting...`);
        window.location.href = `courses.html?course=${courseName}`;
    } else {
        alert("⚠️ You are already enrolled!");
        window.location.href = `courses.html?course=${courseName}`;
    }
}

// Normalize level input (e.g., "beginner" -> "Beginner")
function formatLevel(level) {
    if (!level) return "";
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}

// Check if the user is enrolled
function isUserEnrolled(courseName) {
    let enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
    return enrolledCourses.includes(courseName);
}
