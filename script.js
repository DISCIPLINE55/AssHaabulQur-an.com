// navbar 
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});

function searchSurahs() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let surahList = document.querySelectorAll(".surah-item");

    surahList.forEach(surah => {
        let name = surah.textContent.toLowerCase();
        if (name.includes(input)) {
            surah.style.display = "block";
        } else {
            surah.style.display = "none";
        }
    });
}




//audio player
const audioPlayer = document.getElementById("audioPlayer");
const playButtons = document.querySelectorAll(".play-button");

playButtons.forEach(button => {
    button.addEventListener("click", function() {
        let surahItem = this.parentElement;
        let audioSrc = surahItem.getAttribute("data-audio");
        
        if (audioPlayer.src !== audioSrc) {
            audioPlayer.src = audioSrc;
            audioPlayer.play();
            this.textContent = "⏸"; // Change to pause icon
        } else if (!audioPlayer.paused) {
            audioPlayer.pause();
            this.textContent = "▶"; // Change back to play icon
        } else {
            audioPlayer.play();
            this.textContent = "⏸";
        }
    });
});




const ayahs = [
    "Indeed, with hardship comes ease. (Quran 94:6)",
    "And He found you lost and guided you. (Quran 93:7)",
    "Do not despair of the mercy of Allah. (Quran 39:53)",
    "Indeed, Allah is with the patient. (Quran 2:153)",
    "And He is with you wherever you are. (Quran 57:4)"
];

function getDailyAyah() {
    let today = new Date().toDateString();
    let savedAyah = JSON.parse(localStorage.getItem("dailyAyah"));

    if (!savedAyah || savedAyah.date !== today) {
        let randomAyah = ayahs[Math.floor(Math.random() * ayahs.length)];
        savedAyah = { ayah: randomAyah, date: today };
        localStorage.setItem("dailyAyah", JSON.stringify(savedAyah));
    }

    document.getElementById("dailyAyah").textContent = savedAyah.ayah;
}

// Load the daily Ayah on page load
document.addEventListener("DOMContentLoaded", getDailyAyah);






document.addEventListener("DOMContentLoaded", async function() {
    const surahList = document.getElementById("surahList");

    try {
        // Fetch Surah list
        const response = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await response.json();
        const surahs = data.data;

        // Display Surahs in the list
        surahs.forEach(surah => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<a href="surah.html?surah=${surah.number}">${surah.englishName} (${surah.englishNameTranslation})</a>`;
            listItem.classList.add("surah-item");
            surahList.appendChild(listItem);
        });

    } catch (error) {
        console.error("Error fetching Surahs:", error);
    }
});

// Search function
function searchSurah() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const surahItems = document.querySelectorAll("#surahList li");

    surahItems.forEach(item => {
        const surahName = item.textContent.toLowerCase();
        if (surahName.includes(input)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}



function bookmarkSurah(surahName) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (!bookmarks.includes(surahName)) {
        bookmarks.push(surahName);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
    displayBookmarks();
}

function displayBookmarks() {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    let bookmarkedList = document.getElementById("bookmarkedList");
    bookmarkedList.innerHTML = "";

    bookmarks.forEach(surah => {
        let listItem = document.createElement("li");
        listItem.textContent = surah;

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.onclick = function () {
            removeBookmark(surah);
        };

        listItem.appendChild(removeBtn);
        bookmarkedList.appendChild(listItem);
    });
}

function removeBookmark(surahName) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    bookmarks = bookmarks.filter(surah => surah !== surahName);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks();
}

// Load bookmarks when the page loads
document.addEventListener("DOMContentLoaded", displayBookmarks);



document.getElementById("scholarForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const question = document.getElementById("question").value;
    const responseText = document.getElementById("responseText");
    const aiResponse = document.getElementById("aiResponse");
    const scholarForm = document.getElementById("scholarForm");
    const confirmationMessage = document.getElementById("confirmationMessage");
    const scholarDropdown = document.getElementById("scholarDropdown"); // Assuming there's a dropdown

    // Show AI thinking message
    responseText.innerText = "🔄 Thinking...";
    aiResponse.style.display = "block";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer OPENAI_API_KEY"
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: question }]
            })
        });

        const data = await response.json();
        responseText.innerText = data.choices[0].message.content;

    } catch (error) {
        responseText.innerText = "❌ AI is unavailable. Please try again.";
    }
});

// WhatsApp button redirection
document.getElementById("whatsappBtn").addEventListener("click", function () {
    window.location.href = "https://chat.whatsapp.com/Drx3c72aeCIDWM73PpcGvw";
});

// Submit to scholars button
document.getElementById("submitToScholars").addEventListener("click", async function () {
    const scholarForm = document.getElementById("scholarForm");
    const confirmationMessage = document.getElementById("confirmationMessage");
    const scholarDropdown = document.getElementById("scholarDropdown"); // Assuming there's a dropdown

    // Collect form values
    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        question: document.getElementById("question").value
    };

    try {
        const response = await fetch("https://formspree.io/f/manqvwve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData) // Convert data to JSON format
        });

        if (response.ok) {
            confirmationMessage.innerText = "✅ Your question has been submitted!";
            confirmationMessage.style.display = "block";
            
            // Reset form and hide elements
            scholarForm.reset();
            document.getElementById("aiResponse").style.display = "none"; 
            
            // Close dropdown if it exists
            if (scholarDropdown) {
                scholarDropdown.style.display = "none"; // Assuming this closes it
            }
        } else {
            confirmationMessage.innerText = "❌ Failed to submit. Try again.";
            confirmationMessage.style.display = "block";
        }
    } catch (error) {
        confirmationMessage.innerText = "❌ Error submitting form.";
        confirmationMessage.style.display = "block";
    }
});






let testimonials = document.querySelectorAll(".testimonial");
let index = 0;

function showTestimonial() {
    testimonials.forEach((t, i) => {
        t.style.display = i === index ? "block" : "none";
    });

    index = (index + 1) % testimonials.length;
}

setInterval(showTestimonial, 4000);
showTestimonial();





document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", function() {
        let answer = this.nextElementSibling;
        answer.style.display = answer.style.display === "block" ? "none" : "block";
    });
});




document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    alert("📩 Your message has been sent successfully! We will get back to you soon.");
    
    // Reset form after submission
    this.reset();
});




document.addEventListener("DOMContentLoaded", function () {
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) { // Show after 300px scroll
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });

    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});


const toggleThemeBtn = document.getElementById('toggleTheme');
const currentTheme = localStorage.getItem('theme');

// Apply the saved theme on page load
if (currentTheme) {
    document.body.classList.add(currentTheme);
    toggleThemeBtn.textContent = currentTheme === 'dark-mode' ? '☀' : '🌙';
}

// Toggle theme on button click
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark-mode' : '';
    localStorage.setItem('theme', theme);
    toggleThemeBtn.textContent = theme === 'dark-mode' ? '☀' : '🌙';
});
