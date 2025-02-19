document.addEventListener("DOMContentLoaded", async function () {
    const hadithList = document.getElementById("hadithList");
    const searchInput = document.getElementById("searchInput");
    const toggleTheme = document.getElementById("toggleTheme");

    // Fetch Hadith data from JSON
    async function fetchHadiths() {
        try {
            let response = await fetch("40Hadith.json");
            let hadiths = await response.json();
            displayHadiths(hadiths);
        } catch (error) {
            hadithList.innerHTML = "<p>Error loading Hadiths.</p>";
            console.error("Error fetching Hadiths:", error);
        }
    }

    // Display Hadiths
    function displayHadiths(hadiths) {
        hadithList.innerHTML = "";
        hadiths.forEach(hadith => {
            const hadithCard = document.createElement("div");
            hadithCard.classList.add("hadith-card");
            hadithCard.innerHTML = `
                <h3>${hadith.title}</h3>
                <p><strong>Arabic:</strong> ${hadith.arabic}</p>
                <p><strong>Transliteration:</strong> ${hadith.transliteration}</p>
                <p><strong>Translation:</strong> ${hadith.translation}</p>
                <p><strong>Reference:</strong> ${hadith.reference}</p>
            `;
            hadithList.appendChild(hadithCard);
        });
    }

    // Search Hadith
    searchInput.addEventListener("input", function () {
        let filter = searchInput.value.toLowerCase();
        fetch("40Hadith.json")
            .then(response => response.json())
            .then(hadiths => {
                let filteredHadiths = hadiths.filter(hadith =>
                    hadith.title.toLowerCase().includes(filter) ||
                    hadith.translation.toLowerCase().includes(filter) ||
                    hadith.transliteration.toLowerCase().includes(filter) ||
                    hadith.arabic.includes(filter)
                );
                displayHadiths(filteredHadiths);
            });
    });

    // Toggle Dark Mode
    toggleTheme.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        toggleTheme.textContent = document.body.classList.contains("dark-mode") ? "☀" : "🌙";
    });

    // Load Hadiths
    fetchHadiths();
});
