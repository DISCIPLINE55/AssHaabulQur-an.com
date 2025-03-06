document.addEventListener("DOMContentLoaded", function () {
    /*** Navbar Toggle ***/
    document.addEventListener("DOMContentLoaded", function () {
        const menuToggle = document.getElementById("menuToggle");
        const navLinks = document.querySelector(".nav-links");
    
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    });
    

    /*** Theme Toggle ***/
    const toggleThemeBtn = document.getElementById("toggleTheme");
    const body = document.body;

    function setTheme(mode) {
        if (mode === "dark") {
            body.classList.add("dark-mode");
            toggleThemeBtn.textContent = "☀️";
            localStorage.setItem("theme", "dark");
        } else {
            body.classList.remove("dark-mode");
            toggleThemeBtn.textContent = "🌙";
            localStorage.setItem("theme", "light");
        }
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    toggleThemeBtn.addEventListener("click", function () {
        const currentTheme = body.classList.contains("dark-mode") ? "light" : "dark";
        setTheme(currentTheme);
    });

    /*** Show Login/Register or Dashboard ***/
    const dashboardLink = document.getElementById("dashboard-link");
    const authLinks = document.getElementById("auth-links");

    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        // User is logged in: Show Dashboard, Hide Login/Register
        if (dashboardLink) dashboardLink.style.display = "flex";
        if (authLinks) authLinks.style.display = "none";
    } else {
        // User is NOT logged in: Show Login/Register, Hide Dashboard
        if (dashboardLink) dashboardLink.style.display = "none";
        if (authLinks) authLinks.style.display = "flex";
    }

    /*** Logout Functionality ***/
    const logoutBtn = document.querySelector(".logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("loggedInUser"); // Remove user data
            alert("Logged out successfully!");
            window.location.href = "login.html"; // Redirect to login page
        });
    }


    const backToTopBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = "block"; // Make button visible
        } else {
            backToTopBtn.style.display = "none"; // Hide when at top
        };
    });

    backToTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });


    /*** Smooth Section Loading Animation ***/
    const sections = document.querySelectorAll("section, div");

    function revealSections() {
        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight - 100) {
                section.classList.add("visible");
            };
        });
    };

    window.addEventListener("scroll", revealSections);
    revealSections();
});



    /*** Read More Functionality ***/
    const readMoreLinks = document.querySelectorAll(".read-more");

    readMoreLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const fullContent = this.previousElementSibling;

            if (fullContent.style.display === "none" || fullContent.style.display === "") {
                fullContent.style.display = "block";
                this.textContent = "Read Less";
            } else {
                fullContent.style.display = "none";
                this.textContent = "Read More";
            };
        });
    });

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
        };
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
    };
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
            };
        });
    };



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
    const confirmationMessage = document.getElementById("confirmationMessage");
    const scholarDropdown = document.getElementById("scholarDropdown"); // Assuming there's a dropdown

    // OpenAI Scholar Form Submission
    const scholarForm = document.getElementById("scholarForm");

    if (scholarForm) {
        scholarForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const query = document.getElementById("scholarQuery").value;

            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer YOUR_OPENAI_API_KEY"
                    },
                    body: JSON.stringify({
                        model: "gpt-4",
                        messages: [{ role: "user", content: query }],
                        max_tokens: 100
                    })
                });

                const data = await response.json();
                document.getElementById("scholarResult").textContent = data.choices[0].message.content;
            } catch (error) {
                console.error("Error fetching AI response:", error);
            };
        });
    };
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
    };
});


    // Testimonials Auto-Switch
    let testimonials = document.querySelectorAll(".testimonial");
    let currentTestimonial = 0;

    function showTestimonial() {
        testimonials.forEach(t => t.style.display = "none");
        testimonials[currentTestimonial].style.display = "block";
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    }

    if (testimonials.length > 0) {
        showTestimonial();
        setInterval(showTestimonial, 5000);
    };




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
    const dropdownBtn = document.getElementById("surahDropdown");
    const surahList = document.getElementById("surahList");

   
    // Toggle dropdown
    dropdownBtn.addEventListener("click", function () {
        surahList.style.display = surahList.style.display === "block" ? "none" : "block";
    });

    // Hide dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!dropdownBtn.contains(event.target) && !surahList.contains(event.target)) {
            surahList.style.display = "none";
        };
    });

    // Surah loading is handled by the DOMContentLoaded event listener above
});


document.addEventListener("DOMContentLoaded", function () {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        alert("You must log in to access this page!");
        window.location.href = "login.html"; // Redirect to login page
    };
});


document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.querySelector(".logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("isLoggedIn"); // Remove login status
            alert("Logged out successfully!");
            window.location.href = "login.html"; // Redirect to login
        });
    };
});

    const dashboardLink = document.getElementById("dashboard-link");
    const authLinks = document.getElementById("auth-links");
    
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        // User is logged in: Show Dashboard, Hide Login/Register
        dashboardLink.style.display = "flex";
        authLinks.style.display = "none";
    } else {
        // User is NOT logged in: Show Login/Register, Hide Dashboard
        dashboardLink.style.display = "none";
        authLinks.style.display = "flex";
    }

    // Load user data
    function searchAll() {
        let input = document.getElementById("searchInput").value.toLowerCase();
        let sections = document.querySelectorAll("section, div, h2, h3, p"); 
        let noResults = document.getElementById("noResults");
        let found = false;
    
        sections.forEach(section => {
            let text = section.textContent.toLowerCase();
            if (text.includes(input)) {
                section.style.display = "";
                found = true;
            } else {
                section.style.display = "none";
            }
        });
    
        if (!found) {
            noResults.style.display = "block";
        } else {
            noResults.style.display = "none";
        };
    };
  
