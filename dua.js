document.addEventListener("DOMContentLoaded", async function () {
    const duaList = document.getElementById("duaList");
    const searchInput = document.getElementById("searchInput");
    const toggleTheme = document.getElementById("toggleTheme");

    // Fetch Duas from API
    async function fetchDuas() {
        try {
            let response = await fetch("https://ahadith.co.uk/fortressofthemuslim.php", {
                headers: { "X-API-Key": "YOUR_API_KEY_HERE" }
            });
            let data = await response.json();
            displayDuas(data);
        } catch (error) {
            duaList.innerHTML = "<p>Error fetching Duas.</p>";
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
                <p><strong>Translation:</strong> ${dua.translation}</p>
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
