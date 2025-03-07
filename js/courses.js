document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const courseName = urlParams.get("course");

    const menuToggle = document.querySelector("#menuToggle");
    const navLinks = document.querySelector(".nav-links");

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Check if course is provided
    if (!courseName) {
        document.getElementById("course-content").innerHTML = "<p>⚠️ No course selected. Please choose a course.</p>";
        return;
    }

    // Check if user is enrolled
    if (!isUserEnrolled(courseName)) {
        document.getElementById("course-content").innerHTML = "<p>⚠️ You are not enrolled in this course. Please enroll first.</p>";
        return;
    }

    if (courseName === "tajweed") {
        let selectedLevel = localStorage.getItem("tajweedLevel") || "Beginner"; // Default to Beginner

        const tajweedLevels = {
            Beginner: {
                title: "Beginner Tajweed",
                content: `
                    <p>Learn the basics of Arabic pronunciation and simple Tajweed rules.</p>
                    <iframe src="https://www.youtube.com/embed/kklrHE85hHE" allowfullscreen></iframe>
                    <p><a href="/pdf/Beginners_tajweed.pdf" download>📄 Download Course Notes</a></p>
                `,
                nextLevel: "Intermediate"
            },
            Intermediate: {
                title: "Intermediate Tajweed",
                content: `
                    <p>Dive deeper into Makharij (pronunciation) and rules like Ikhfa, Idgham.</p>
                    <iframe src="https://www.youtube.com/embed/oC_LBcbNCPM" allowfullscreen></iframe>
                    <p><a href="/pdf/intermediate-tajweed.pdf" download>📄 Download Course Notes</a></p>
                `,
                nextLevel: "Advanced"
            },
            Advanced: {
                title: "Advanced Tajweed",
                content: `
                    <p>Master advanced rules like Qalqalah, Madd, and Tarteel.</p>
                    <iframe src="https://www.youtube.com/embed/xq4rm8Y-jlI" allowfullscreen></iframe>
                    <p><a href="/" download>📄 Download Course Notes</a></p>
                `,
                nextLevel: null // No level after Advanced
            }
        };

        document.getElementById("course-title").textContent = tajweedLevels[selectedLevel].title;
        document.getElementById("course-content").innerHTML = tajweedLevels[selectedLevel].content;

        // Level Selection Buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.style.marginTop = "20px";
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";

        ["Beginner", "Intermediate", "Advanced"].forEach(level => {
            const levelButton = document.createElement("button");
            levelButton.textContent = level;
            levelButton.classList.add("tajweed-btn");
            levelButton.style.backgroundColor = selectedLevel === level ? "#009688" : "#ccc";
            levelButton.style.color = "white";
            levelButton.disabled = selectedLevel !== level && !hasCompletedLevel(level);

            levelButton.onclick = function () {
                if (hasCompletedLevel(level)) {
                    localStorage.setItem("tajweedLevel", level);
                    location.reload();
                }
            };

            buttonContainer.appendChild(levelButton);
        });

        document.getElementById("course-content").appendChild(buttonContainer);

        // Summary Input for Next Level
        const nextLevel = tajweedLevels[selectedLevel].nextLevel;
        if (nextLevel) {
            const summaryContainer = document.createElement("div");
            summaryContainer.innerHTML = `
                <p>📝 Before moving to <b>${nextLevel}</b>, write a 50-word summary of this level:</p>
                <textarea id="summaryInput" rows="4" style="width: 100%; padding: 10px;"></textarea>
                <button id="submitSummary">Submit Summary</button>
            `;
            document.getElementById("course-content").appendChild(summaryContainer);

            document.getElementById("submitSummary").addEventListener("click", function () {
                const summaryText = document.getElementById("summaryInput").value.trim();
                if (summaryText.split(" ").length >= 50) {
                    saveCompletedLevel(selectedLevel);
                    alert("✅ Summary submitted! You can now proceed to the next level.");
                    location.reload();
                } else {
                    alert("⚠️ Your summary must be at least 50 words.");
                }
            });
        }
    } 
    else if (courseName === "memorization") {
        window.location.href = "surah.html";
    } 
    else {
        const otherCourses = {
            tafseer: {
                title: "Tafseer Quran",
                content: `
                    <p>Deepen your understanding of the Quran with Tafseer lessons.</p>
                    <iframe width="350" height="350" src="https://www.youtube-nocookie.com/embed/v0r76TgXL4E?start=285" allowfullscreen></iframe>
                    <p><a href="pdfs/tafseer.pdf" download>📄 Download Course Notes</a></p>
                `
            }
        };

        if (otherCourses[courseName]) {
            document.getElementById("course-title").textContent = otherCourses[courseName].title;
            document.getElementById("course-content").innerHTML = otherCourses[courseName].content;
        } else {
            document.getElementById("course-content").innerHTML = "<p>⚠️ Course not found.</p>";
        }
    }
});

// Check if user is enrolled
function isUserEnrolled(courseName) {
    let enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
    return enrolledCourses.includes(courseName);
}

// Check if level is completed
function hasCompletedLevel(level) {
    let completedLevels = JSON.parse(localStorage.getItem("completedTajweedLevels")) || [];
    return completedLevels.includes(level);
}

// Save completed level
function saveCompletedLevel(level) {
    let completedLevels = JSON.parse(localStorage.getItem("completedTajweedLevels")) || [];
    if (!completedLevels.includes(level)) {
        completedLevels.push(level);
        localStorage.setItem("completedTajweedLevels", JSON.stringify(completedLevels));
    }
}
