document.addEventListener("DOMContentLoaded", async function () { 
    const urlParams = new URLSearchParams(window.location.search);
    const surahNumber = urlParams.get("surah");

    if (!surahNumber) {
        alert("Invalid Surah");
        window.location.href = "index.html"; // Redirect to home if no Surah is selected
        return;
    }

    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        const data = await response.json();
        const surah = data.data;

        const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`);
        const translationData = await translationResponse.json();

        const transliterationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.transliteration`);
        const transliterationData = await transliterationResponse.json();

        const verseAudioResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
        const verseAudioData = await verseAudioResponse.json();

        const fullSurahAudioUrl = `https://server8.mp3quran.net/afs/${surahNumber.padStart(3, '0')}.mp3`;

        document.getElementById("surahTitle").innerText = `${surah.englishName} (${surah.name})`;
        document.getElementById("surahTranslation").innerText = `Translation: ${surah.englishNameTranslation}`;
        document.getElementById("revelationType").innerText = `Revealed in: ${surah.revelationType}`;

        const verseList = document.getElementById("verseList");
        verseList.innerHTML = ""; // Clear previous content

        let memorizedVerses = JSON.parse(localStorage.getItem(`memorizedSurah${surahNumber}`)) || [];
        let bookmarkedVerses = JSON.parse(localStorage.getItem("bookmarkedVerses")) || {};

        surah.ayahs.forEach((ayah, index) => {
            const translationText = translationData.data.ayahs[index]?.text || "Translation not available";
            const transliterationText = transliterationData.data.ayahs[index]?.text || "Transliteration not available";
            const audioUrl = verseAudioData.data.ayahs[index]?.audio || "";

            const isMemorized = memorizedVerses.includes(ayah.numberInSurah) ? "✔ Memorized" : "🔒 Not Memorized";
            const isBookmarked = bookmarkedVerses[ayah.number] ? "⭐ Bookmarked" : "☆ Bookmark";

            const verseItem = document.createElement("li");
            verseItem.innerHTML = `
                <p><strong>Verse ${ayah.numberInSurah}:</strong></p>
                <p style="font-size: 20px; direction: rtl;">${ayah.text}</p> <!-- Arabic -->
                <p><em>Transliteration:</em> ${transliterationText}</p> 
                <p><strong>Translation:</strong> ${translationText}</p> 
                <button class="play-audio btn-small" data-audio="${audioUrl}">🔊</button>
                <button class="pause-audio btn-small">⏸</button>
                <button class="repeat-audio btn-small" data-audio="${audioUrl}">🔁</button>
                <button class="mark-memorized btn-small" data-ayah="${ayah.numberInSurah}">${isMemorized}</button>
                <button class="bookmark-verse btn-small" data-ayah="${ayah.number}">${isBookmarked}</button>
                <hr>
            `;
            verseList.appendChild(verseItem);
        });

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

        document.querySelectorAll(".pause-audio").forEach(button => {
            button.addEventListener("click", function () {
                verseAudioPlayer.pause();
            });
        });

        document.querySelectorAll(".mark-memorized").forEach(button => {
            button.addEventListener("click", function () {
                let ayahNumber = parseInt(this.getAttribute("data-ayah"));
                let memorizedVerses = JSON.parse(localStorage.getItem(`memorizedSurah${surahNumber}`)) || [];

                if (memorizedVerses.includes(ayahNumber)) {
                    memorizedVerses = memorizedVerses.filter(num => num !== ayahNumber);
                } else {
                    memorizedVerses.push(ayahNumber);
                }

                localStorage.setItem(`memorizedSurah${surahNumber}`, JSON.stringify(memorizedVerses));
                location.reload();
            });
        });

        document.querySelectorAll(".bookmark-verse").forEach(button => {
            button.addEventListener("click", function () {
                let ayahNumber = this.getAttribute("data-ayah");
                let bookmarkedVerses = JSON.parse(localStorage.getItem("bookmarkedVerses")) || {};

                if (bookmarkedVerses[ayahNumber]) {
                    delete bookmarkedVerses[ayahNumber];
                } else {
                    bookmarkedVerses[ayahNumber] = {
                        surah: surahNumber,
                        ayah: ayahNumber,
                        text: this.parentElement.querySelector("p[style]").innerText // Get Arabic text
                    };
                }

                localStorage.setItem("bookmarkedVerses", JSON.stringify(bookmarkedVerses));
                location.reload();
            });
        });

        const fullSurahAudioPlayer = document.getElementById("fullSurahAudio");
        fullSurahAudioPlayer.src = fullSurahAudioUrl;

        document.getElementById("playFullSurah").addEventListener("click", function () {
            fullSurahAudioPlayer.play();
        });

        document.getElementById("pauseFullSurah").addEventListener("click", function () {
            fullSurahAudioPlayer.pause();
        });

        document.getElementById("stopFullSurah").addEventListener("click", function () {
            fullSurahAudioPlayer.pause();
            fullSurahAudioPlayer.currentTime = 0;
        });

        loadSurahOptions();
    } catch (error) {
        console.error("Error fetching Surah details:", error);
    }
});

// Load Surah Dropdown
async function loadSurahOptions() {
    try {
        const response = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await response.json();
        const surahList = data.data;

        const surahSelector = document.getElementById("surahSelector");
        surahList.forEach(surah => {
            let option = document.createElement("option");
            option.value = surah.number;
            option.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
            surahSelector.appendChild(option);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const currentSurah = urlParams.get("surah");
        surahSelector.value = currentSurah;

        surahSelector.addEventListener("change", function () {
            let selectedSurah = this.value;
            window.location.href = `surah.html?surah=${selectedSurah}`;
        });
    } catch (error) {
        console.error("Error loading Surah options:", error);
    }
}
