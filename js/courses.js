document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const courseName = urlParams.get("course");

    const menuToggle = document.querySelector("#menuToggle");
    const navLinks = document.querySelector(".nav-links");
    const body = document.body;

    // Mobile Menu Toggle
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

   
    if (!courseName || !isUserEnrolled(courseName)) {
        document.getElementById("course-content").innerHTML = "<p>⚠️ You are not enrolled in this course. Please enroll first.</p>";
        return;
    }

    if (courseName === "tajweed") {
        let selectedLevel = localStorage.getItem("tajweedLevel") || "Beginner"; // Default to Beginner

        // Course Content
        const tajweedLevels = {
            Beginner: {
                title: "Beginner Tajweed",
                content: `
                    <div class="tajweed-course">
                        <p>Learn the basics of Arabic pronunciation and simple Tajweed rules.</p>
                        <div class="tajweed-video-container">
                            <iframe src="https://www.youtube.com/embed/kklrHE85hHE" allowfullscreen></iframe>
                        </div>
                        <p><a href="/pdf/Beginners_tajweed.pdf" download>📄 Download Course Notes</a></p>
                    </div>
                `,
                nextLevel: "Intermediate"
            },
            Intermediate: {
                title: "Intermediate Tajweed",
                content: `
                    <div class="tajweed-course">
                        <p>Dive deeper into Makharij (pronunciation) and rules like Ikhfa, Idgham.</p>
                        <div class="tajweed-video-container">
                            <iframe src="https://www.youtube.com/embed/oC_LBcbNCPM" allowfullscreen></iframe>
                        </div>
                        <p><a href="/pdf/intermediate-tajweed.pdf" download>📄 Download Course Notes</a></p>
                    </div>
                `,
                nextLevel: "Advanced"
            },
            Advanced: {
                title: "Advanced Tajweed",
                content: `
                    <div class="tajweed-course">
                        <p>Master advanced rules like Qalqalah, Madd, and Tarteel.</p>
                        <div class="tajweed-video-container">
                            <iframe src="https://www.youtube.com/embed/xq4rm8Y-jlI" allowfullscreen></iframe>
                        </div>
                        <p><a href="/" download>📄 Download Course Notes</a></p>
                    </div>
                `,
                nextLevel: null // No level after Advanced
            }
        };

        // Set Course Title & Content
        document.getElementById("course-title").textContent = tajweedLevels[selectedLevel].title;
        document.getElementById("course-content").innerHTML = tajweedLevels[selectedLevel].content;

        // Create a container for buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.style.marginTop = "20px";
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";

        // Level Switch Buttons (Disabled by default)
        ["Beginner", "Intermediate", "Advanced"].forEach(level => {
            const levelButton = document.createElement("button");
            levelButton.textContent = level;
            levelButton.style.padding = "10px 15px";
            levelButton.style.border = "none";
            levelButton.style.cursor = "pointer";
            levelButton.style.backgroundColor = selectedLevel === level ? "#007BFF" : "#ccc";
            levelButton.style.color = "white";
            levelButton.style.fontWeight = "bold";
            levelButton.disabled = selectedLevel !== level && !hasCompletedLevel(level);

            levelButton.onclick = function () {
                if (hasCompletedLevel(level)) {
                    localStorage.setItem("tajweedLevel", level);
                    location.reload(); // Reload to update content
                }
            };

            buttonContainer.appendChild(levelButton);
        });

        document.getElementById("course-content").appendChild(buttonContainer);

        // Show Summary Input if Next Level Exists
        const nextLevel = tajweedLevels[selectedLevel].nextLevel;
        if (nextLevel) {
            const summaryContainer = document.createElement("div");
            summaryContainer.innerHTML = `
                <p>📝 Before moving to <b>${nextLevel}</b>, write a 50-word summary of this level:</p>
                <textarea id="summaryInput" rows="4" style="width: 100%; padding: 10px;"></textarea>
                <button id="submitSummary" style="margin-top: 10px; padding: 10px; background-color: green; color: white; border: none; cursor: pointer;">Submit Summary</button>
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
        // Redirect to surah.html for Quran Memorization Course
        window.location.href = "surah.html";
    }
    else {
        const otherCourses = {
            tafseer: {
                title: "Tafseer Quran",
                content: `
                    <div class="tafseer-course">
                        <p>Deepen your understanding of the Quran with Tafseer lessons.</p>
                        <div class="tajweed-video-container">
                            <iframe width="250" height="250" src="https://www.youtube-nocookie.com/embed/v0r76TgXL4E?si=Y4Nak2gxdT8w-pgQ&amp;start=285" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>
                        <p><a href="pdfs/tafseer.pdf" download>📄 Download Course Notes</a></p>
                    </div>
                `
            }
        };

        document.getElementById("course-title").textContent = otherCourses[courseName].title;
        document.getElementById("course-content").innerHTML = otherCourses[courseName].content;

        // "Back to Home" Button for other courses
        const homeButton = document.createElement("button");
        homeButton.textContent = "🏠 Back to Home";
        homeButton.style.padding = "10px 15px";
        homeButton.style.border = "none";
        homeButton.style.cursor = "pointer";
        homeButton.style.backgroundColor = "#28a745";
        homeButton.style.color = "white";
        homeButton.style.fontWeight = "bold";
        homeButton.style.marginTop = "20px";

        homeButton.onclick = function () {
            window.location.href = "index.html";
        };

        document.getElementById("course-content").appendChild(homeButton);
    }
});

// Check if the user is enrolled
function isUserEnrolled(courseName) {
    let enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
    return enrolledCourses.includes(courseName);
}

// Check if the user has completed a level
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
