document.addEventListener("DOMContentLoaded", async function () {
    const duaList = document.getElementById("duaList");
    const searchInput = document.getElementById("searchInput");
    const toggleTheme = document.getElementById("toggleTheme");

    // Fetch Duas from Local JSON File
    async function fetchDuas() {
        try {
            let response = await fetch("/json/duas.json");

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            let data = await response.json();

            if (data && Array.isArray(data)) {
                displayDuas(data);
            } else {
                throw new Error("Invalid JSON Structure");
            }
        } catch (error) {
            duaList.innerHTML = "<p>Error fetching Duas. Please try again later.</p>";
            console.error("Error fetching Duas:", error);
        }
    }

    // Display Duas in UI
    function displayDuas(duas) {
        duaList.innerHTML = "";
        duas.forEach(dua => {
            const duaCard = document.createElement("div");
            duaCard.classList.add("dua-card");
            duaCard.innerHTML = `
                <h3>${dua.title}</h3>
                <p><strong>Arabic:</strong> ${dua.arabic}</p>
                <p><strong>Transliteration:</strong> ${dua.transliteration}</p>
                <p><strong>Translation:</strong> ${dua.translation}</p>
                <p><strong>Reference:</strong> ${dua.reference}</p>
                ${dua.audio ? `<audio controls src="${dua.audio}"></audio>` : ""}
            `;
            duaList.appendChild(duaCard);
        });
    }

    // Search Dua
    searchInput.addEventListener("input", function () {
        let filter = searchInput.value.toLowerCase();
        let duaCards = document.querySelectorAll(".dua-card");
        duaCards.forEach(card => {
            card.style.display = card.innerText.toLowerCase().includes(filter) ? "block" : "none";
        });
    });

    // Toggle Dark Mode
    toggleTheme.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        toggleTheme.textContent = document.body.classList.contains("dark-mode") ? "☀" : "🌙";
    });

    // Load Duas
    fetchDuas();
});
