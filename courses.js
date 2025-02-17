document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const courseName = urlParams.get("course");

    if (!courseName || !isUserEnrolled(courseName)) {
        document.getElementById("course-content").innerHTML = "<p>⚠️ You are not enrolled in this course. Please enroll first.</p>";
        return;
    }

    if (courseName === "tajweed") {
        let selectedLevel = localStorage.getItem("tajweedLevel") || "Beginner"; // Default to Beginner

        // Tajweed Course Levels
        const tajweedLevels = {
            Beginner: {
                title: "Beginner Tajweed",
                content: `<p>Learn the basics of Arabic pronunciation and simple Tajweed rules.</p>
                          <iframe width="100%" height="315" src="https://www.youtube.com/embed/kklrHE85hHE" frameborder="0" allowfullscreen></iframe>
                          <p><a href="/pdf/Beginners_tajweed.pdf" download>📄 Download Course Notes</a></p>`
            },
            Intermediate: {
                title: "Intermediate Tajweed",
                content: `<p>Dive deeper into Makharij (pronunciation) and rules like Ikhfa, Idgham.</p>
                          <iframe width="100%" height="315" src="https://www.youtube.com/embed/oC_LBcbNCPM" frameborder="0" allowfullscreen></iframe>
                          <p><a href="/pdf/intermediate-tajweed.pdf" download>📄 Download Course Notes</a></p>`
            },
            Advanced: {
                title: "Advanced Tajweed",
                content: `<p>Master advanced rules like Qalqalah, Madd, and Tarteel.</p>
                          <iframe width="100%" height="315" src="https://www.youtube.com/embed/xq4rm8Y-jlI" frameborder="0" allowfullscreen></iframe>
                          <p><a href="/" download>📄 Download Course Notes</a></p>`
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

        // Level Switch Buttons
        ["Beginner", "Intermediate", "Advanced"].forEach(level => {
            const levelButton = document.createElement("button");
            levelButton.textContent = level;
            levelButton.style.padding = "10px 15px";
            levelButton.style.border = "none";
            levelButton.style.cursor = "pointer";
            levelButton.style.backgroundColor = selectedLevel === level ? "#007BFF" : "#ccc";
            levelButton.style.color = "white";
            levelButton.style.fontWeight = "bold";

            levelButton.onclick = function () {
                localStorage.setItem("tajweedLevel", level);
                location.reload(); // Reload to update content
            };

            buttonContainer.appendChild(levelButton);
        });

        // "Back to Home" Button
        const homeButton = document.createElement("button");
        homeButton.textContent = "🏠 Back to Home";
        homeButton.style.padding = "10px 15px";
        homeButton.style.border = "none";
        homeButton.style.cursor = "pointer";
        homeButton.style.backgroundColor = "#28a745"; // Green color for home button
        homeButton.style.color = "white";
        homeButton.style.fontWeight = "bold";

        homeButton.onclick = function () {
            window.location.href = "index.html";
        };

        buttonContainer.appendChild(homeButton);

        document.getElementById("course-content").appendChild(buttonContainer);
    } 
    else if (courseName === "memorization") {
        // Redirect to surah.html for Quran Memorization Course
        window.location.href = "surah.html";
    }
    else {
        const otherCourses = {
            tafseer: {
                title: "Tafseer Quran",
                content: `<p>Deepen your understanding of the Quran with Tafseer lessons.</p>
                          <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/v0r76TgXL4E?si=Y4Nak2gxdT8w-pgQ&amp;start=285" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                          <p><a href="pdfs/tafseer.pdf" download>📄 Download Course Notes</a></p>`
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


