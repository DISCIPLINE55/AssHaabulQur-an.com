let mediaRecorder;
let recordedChunks = {};
let speechRecognition;
let recognitionActive = false;


async function getMicrophoneAccess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return stream;
    } catch (error) {
        console.error("Microphone access denied:", error);
        alert("Please allow microphone access to record your recitation.");
        return null;
    }
}



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

                <!-- Button Container -->
                <div class="button-container">
                    <button class="play-audio btn-small" data-audio="${audioUrl}">🔊</button>
                    <button class="pause-audio btn-small">⏸</button>
                    <button class="repeat-audio btn-small" data-audio="${audioUrl}">🔁</button>
                    <button class="record-audio btn-small" data-ayah="${ayah.numberInSurah}">🎙</button>
                    <button class="play-recording btn-small" data-ayah="${ayah.numberInSurah}" disabled>▶</button>
                    <button class="delete-recording btn-small" data-ayah="${ayah.numberInSurah}" disabled>🗑</button>
                    <button class="check-pronunciation btn-small" data-ayah="${ayah.numberInSurah}" disabled>🔍</button>
                    <button class="mark-memorized btn-small" data-ayah="${ayah.numberInSurah}">${isMemorized}</button>
                </div>
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

        document.querySelectorAll(".record-audio").forEach(button => {
            button.addEventListener("click", function () {
                let ayahNumber = this.getAttribute("data-ayah");

                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    alert("Recording is not supported in this browser.");
                    return;
                }

                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        mediaRecorder = new MediaRecorder(stream);
                        recordedChunks[ayahNumber] = [];

                        mediaRecorder.ondataavailable = event => {
                            if (event.data.size > 0) {
                                recordedChunks[ayahNumber].push(event.data);
                            }
                        };

                        mediaRecorder.onstop = () => {
                            document.querySelector(`.play-recording[data-ayah="${ayahNumber}"]`).disabled = false;
                            document.querySelector(`.delete-recording[data-ayah="${ayahNumber}"]`).disabled = false;
                        };

                        mediaRecorder.start();
                        setTimeout(() => mediaRecorder.stop(), 10000); // Stop after 10 seconds
                    })
                    .catch(error => console.error("Recording error:", error));
            });
        });

        document.querySelectorAll(".play-recording").forEach(button => {
            button.addEventListener("click", function () {
                let ayahNumber = this.getAttribute("data-ayah");

                if (!recordedChunks[ayahNumber] || recordedChunks[ayahNumber].length === 0) {
                    alert("No recording available for this verse.");
                    return;
                }

                let recordedBlob = new Blob(recordedChunks[ayahNumber], { type: "audio/webm" });
                let recordedUrl = URL.createObjectURL(recordedBlob);
                verseAudioPlayer.src = recordedUrl;
                verseAudioPlayer.play();
            });
        });

        document.querySelectorAll(".delete-recording").forEach(button => {
            button.addEventListener("click", function () {
                let ayahNumber = this.getAttribute("data-ayah");

                if (recordedChunks[ayahNumber]) {
                    delete recordedChunks[ayahNumber];
                }

                document.querySelector(`.play-recording[data-ayah="${ayahNumber}"]`).disabled = false;
                document.querySelector(`.delete-recording[data-ayah="${ayahNumber}"]`).disabled = false;

                alert("Recording deleted.");
            });
        });
        


        // Check Pronunciation

        document.querySelector("click", function (event) {
            if (event.target.classList.contains("check-pronunciation")) {
                const ayahNumber = event.target.getAttribute("data-ayah");
                const ayahElement = document.querySelector(`.ayah-text[data-ayah="${ayahNumber}"]`);
                
                if (!ayahElement) {
                    alert("Verse not found.");
                    return;
                }
        
                const ayahText = ayahElement.innerText.trim();
                const words = ayahText.split(" ");
        
                if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
                    alert("Speech recognition is not supported in your browser.");
                    return;
                }
        
                let speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                speechRecognition.lang = "ar-SA";
                speechRecognition.continuous = false;
                speechRecognition.interimResults = false;
        
                speechRecognition.onresult = function (event) {
                    const transcript = event.results[0][0].transcript.trim();
                    const userWords = transcript.split(" ");
                    let highlightedText = "";
        
                    words.forEach((word, index) => {    
                        if (userWords[index]) {
                            const similarity = getSimilarity(userWords[index], word);
        
                            if (similarity >= 0.9) {
                                highlightedText += `<span style="background-color: yellow;">${word}</span> `;
                            } else if (similarity >= 0.7) {
                                highlightedText += `<span class="retry-word" style="background-color: orange; cursor: pointer;" data-word="${word}">${word}</span> `;
                            } else {
                                highlightedText += `<span class="retry-word" style="background-color: red; cursor: pointer;" data-word="${word}">${word}</span> `;
                            }
                        } else {
                            highlightedText += `<span style="background-color: red;">${word}</span> `;
                        }
                    });
        
                    ayahElement.innerHTML = highlightedText;
                };
        
                speechRecognition.onerror = function (event) {
                    alert("Speech recognition error: " + event.error);
                };
        
                speechRecognition.start();
            }
        });
        
        // Handle retry clicking
        document.addEventListener("click", function (event) {
            if (event.target.classList.contains("retry-word")) {
                alert(`Try pronouncing "${event.target.dataset.word}" again.`);
            }
        });
        
        // Mark as Memorized
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
        
        // Bookmark Ayah
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
        
        // Function to Check Word Similarity (You Need to Implement This)
        function getSimilarity(word1, word2) {
            word1 = word1.toLowerCase();
            word2 = word2.toLowerCase();
        
            let matches = 0;
            const minLength = Math.min(word1.length, word2.length);
        
            for (let i = 0; i < minLength; i++) {
                if (word1[i] === word2[i]) matches++;
            }
        
            return matches / Math.max(word1.length, word2.length);
        }
        
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

        const surahSearch = document.getElementById("surahSearch");
        const surahResults = document.getElementById("surahResults");

        // Populate the list with Surahs
        function populateSurahOptions(filteredSurahs) {
            surahResults.innerHTML = ""; // Clear previous results

            if (filteredSurahs.length === 0 || surahSearch.value.trim() === "") {
                surahResults.style.display = "none"; // Hide when no match or empty input
                return;
            }

            surahResults.style.display = "block"; // Show when there are matches

            filteredSurahs.forEach(surah => {
                let listItem = document.createElement("li");
                listItem.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
                listItem.dataset.surahNumber = surah.number;
                listItem.classList.add("surah-item"); // For styling
                surahResults.appendChild(listItem);
            });
        }

        populateSurahOptions(surahList); // Initially load all Surahs

        // Search functionality
        surahSearch.addEventListener("keyup", function () {
            let searchValue = this.value.toLowerCase();

            let filteredSurahs = surahList.filter(surah =>
                surah.englishName.toLowerCase().includes(searchValue) ||
                surah.name.toLowerCase().includes(searchValue)
            );

            populateSurahOptions(filteredSurahs); // Show only matching Surahs
        });

        // Click event for Surah selection
        surahResults.addEventListener("click", function (event) {
            if (event.target.classList.contains("surah-item")) {
                let selectedSurah = event.target.dataset.surahNumber;
                window.location.href = `surah.html?surah=${selectedSurah}`;
            }
        });

        // Hide the list if input is empty or loses focus
        surahSearch.addEventListener("blur", function () {
            setTimeout(() => {
                surahResults.style.display = "none";
            }, 200); // Short delay to allow clicking
        });

        surahSearch.addEventListener("focus", function () {
            if (surahSearch.value.trim() !== "") {
                surahResults.style.display = "block";
            }
        });

    } catch (error) {
        console.error("Error loading Surah options:", error);
    }
}
