document.addEventListener("DOMContentLoaded", function () {
    // 🌙 Dark Mode
    const themeToggle = document.getElementById("themeToggle");

    // Apply saved theme
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        themeToggle.checked = true;
    }

    themeToggle.addEventListener("change", function () {
        if (this.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
    });
});


    // 🔖 Bookmark System
    const bookmarkBtn = document.getElementById("bookmarkBtn");
    const viewBookmarks = document.getElementById("viewBookmarks");
    const bookmarkList = document.getElementById("bookmarkList");

    bookmarkBtn.addEventListener("click", function () {
        const urlParams = new URLSearchParams(window.location.search);
        const surahNumber = urlParams.get("surah");
        const verseNumber = prompt("Enter Ayah number to bookmark:");

        if (verseNumber) {
            const bookmark = { surah: surahNumber, verse: verseNumber };

            let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
            bookmarks.push(bookmark);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

            alert(`Bookmark added: Surah ${surahNumber}, Ayah ${verseNumber}`);
        }
    });

    viewBookmarks.addEventListener("click", function () {
        bookmarkList.innerHTML = "";
        let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

        if (bookmarks.length === 0) {
            alert("No bookmarks found.");
            return;
        }

        bookmarks.forEach((bookmark, index) => {
            let li = document.createElement("li");
            li.innerHTML = `📌 Surah ${bookmark.surah}, Ayah ${bookmark.verse} 
                            <button onclick="deleteBookmark(${index}, ${bookmark.surah})">❌</button>
                            <button onclick="loadSurah(${bookmark.surah}, ${bookmark.verse})">Go</button>`;
            bookmarkList.appendChild(li);
        });
    });

    window.deleteBookmark = function (index, surahNumber) {
        let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
        bookmarks.splice(index, 1);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        window.location.href = `?surah=${surahNumber}`; // Reload with the Surah page
    };

    // 📖 Load Surah Without Reloading
    window.loadSurah = function (surahNumber, verseNumber) {
        window.history.pushState({}, "", `?surah=${surahNumber}#ayah${verseNumber}`);
        fetchSurahData(surahNumber, verseNumber);
    };

    // 📜 Fetch and Display Surah Data
    async function fetchSurahData(surahNumber, highlightVerse = null) {
        try {
            // Fetch Arabic text
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
            const data = await response.json();
            const surah = data.data;

            // Fetch translation
            const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`);
            const translationData = await translationResponse.json();

            // Fetch transliteration
            const transliterationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.transliteration`);
            const transliterationData = await transliterationResponse.json();

            // Fetch verse-wise audio
            const verseAudioResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
            const verseAudioData = await verseAudioResponse.json();

            // Full Surah Audio
            const fullSurahAudioUrl = `https://server8.mp3quran.net/afs/${surahNumber.padStart(3, '0')}.mp3`;

            document.getElementById("surahTitle").innerText = `${surah.englishName} (${surah.name})`;
            document.getElementById("surahTranslation").innerText = `Translation: ${surah.englishNameTranslation}`;
            document.getElementById("revelationType").innerText = `Revealed in: ${surah.revelationType}`;

            const verseList = document.getElementById("verseList");
            verseList.innerHTML = ""; // Clear previous content

            surah.ayahs.forEach((ayah, index) => {
                const translationText = translationData.data.ayahs[index]?.text || "Translation not available";
                const transliterationText = transliterationData.data.ayahs[index]?.text || "Transliteration not available";
                const audioUrl = verseAudioData.data.ayahs[index]?.audio || ""; // Verse audio

                const verseItem = document.createElement("li");
                verseItem.id = `ayah${ayah.numberInSurah}`;

                verseItem.innerHTML = `
                    <p><strong>Verse ${ayah.numberInSurah}:</strong></p>
                    <p style="font-size: 20px; direction: rtl;">${ayah.text}</p>
                    <p><em>Transliteration:</em> ${transliterationText}</p>
                    <p><strong>Translation:</strong> ${translationText}</p>
                    <button class="play-audio" data-audio="${audioUrl}">🔊 Play</button>
                    <button class="repeat-audio" data-audio="${audioUrl}">🔁 Repeat</button>
                    <hr>
                `;

                if (highlightVerse && ayah.numberInSurah === Number(highlightVerse)) {
                    verseItem.style.backgroundColor = "yellow"; // Highlight bookmarked verse
                    setTimeout(() => verseItem.scrollIntoView({ behavior: "smooth" }), 500);
                }
                

                verseList.appendChild(verseItem);
            });

            // 🎵 Add Audio Player Functionality
            let verseAudioPlayer = document.getElementById("verseAudioPlayer");
            let isRepeating = false;

            document.querySelectorAll(".play-audio").forEach(button => {
                button.addEventListener("click", function () {
                    let audioSrc = this.getAttribute("data-audio");

                    if (audioSrc) {
                        isRepeating = false;
                        verseAudioPlayer.loop = false;
                        verseAudioPlayer.src = audioSrc;
                        verseAudioPlayer.play();
                    } else {
                        alert("Audio not available for this verse.");
                    }
                });
            });

            document.querySelectorAll(".repeat-audio").forEach(button => {
                button.addEventListener("click", function () {
                    let audioSrc = this.getAttribute("data-audio");

                    if (audioSrc) {
                        isRepeating = true;
                        verseAudioPlayer.loop = true;
                        verseAudioPlayer.src = audioSrc;
                        verseAudioPlayer.play();
                    } else {
                        alert("Audio not available for this verse.");
                    }
                });
            });

            // Full Surah Audio Player
            const fullSurahAudioPlayer = document.getElementById("fullSurahAudio");
            fullSurahAudioPlayer.src = fullSurahAudioUrl;

        } catch (error) {
            console.error("Error fetching Surah details:", error);
        }
    }

    // 🚀 Load Surah on Page Load
    const urlParams = new URLSearchParams(window.location.search);
    const surahNumber = urlParams.get("surah") || 1;
    const verseNumber = window.location.hash.replace("#ayah", "") || null;

    fetchSurahData(surahNumber, verseNumber);

