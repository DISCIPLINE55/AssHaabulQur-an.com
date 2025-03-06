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
    };
};

document.addEventListener("DOMContentLoaded", () => {
    const audioPlayer = document.getElementById("audioPlayer");
    const surahDropdown = document.getElementById("surahDropdown");
    const reciterDropdown = document.getElementById("reciterDropdown");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const progressBar = document.getElementById("progressBar");
    const currentTimeDisplay = document.getElementById("currentTime");
    const durationDisplay = document.getElementById("duration");
    const prevTrackBtn = document.getElementById("prevTrack");
    const nextTrackBtn = document.getElementById("nextTrack");
    const volumeControl = document.getElementById("volumeControl");
    const speedControl = document.getElementById("speedControl");
    const loopBtn = document.getElementById("loopBtn");
    const themeToggle = document.getElementById("themeToggle");
    const nowPlaying = document.getElementById("nowPlaying");
    const playerImage = document.getElementById("playerImage");
    const verseContainer = document.getElementById("verseContainer");
    const surahTitle = document.getElementById("surahTitle");
    const surahTranslation = document.getElementById("surahTranslation");
    const revelationType = document.getElementById("revelationType");
    const surahDescription = document.getElementById("surahDescription");
    const verseList = document.getElementById("verseList");
    const verseAudioPlayer = document.getElementById("verseAudioPlayer");

    let surahList = []; // Store Surah names and IDs

    // 🔹 Fetch Surah List and Populate Dropdown
    fetch("https://api.alquran.cloud/v1/surah")
        .then(response => response.json())
        .then(data => {
            if (data.status === "OK") {
                surahDropdown.innerHTML = '<option value="">Select a Surah</option>';
                data.data.forEach(surah => {
                    let option = document.createElement("option");
                    option.value = surah.number;
                    option.textContent = `${surah.number}. ${surah.englishName}`;
                    surahDropdown.appendChild(option);
                });
            };
        })
        .catch(error => console.error("Error fetching Surahs:", error));

    // 🔹 Get Audio URL
    async function getAudioURL(surahNumber, reciterKey) {
        const formattedSurah = String(surahNumber).padStart(3, '0');
        const reciterURLs = {
            "mishari_al_afasy": `https://server8.mp3quran.net/afs/${formattedSurah}.mp3`,
            "shuraim": `https://server7.mp3quran.net/shur/${formattedSurah}.mp3`,
            "abdul_baset/murattal": `https://download.quranicaudio.com/qdc/abdul_baset/murattal/${surahNumber}.mp3`
        };

        if (reciterKey === "offline") {
            return `audio/offline/${formattedSurah}.mp3`;
        };

        let url = reciterURLs[reciterKey] || null;
        return (await checkURL(url)) ? url : null;
    };

    // 🔹 Check if URL is Reachable
    async function checkURL(url) {
        if (!url) return false;
        try {
            let response = await fetch(url, { method: "HEAD" });
            return response.ok;
        } catch (error) {
            return false;
        };
    };

    // 🔹 Get Reciter Image
    function getReciterImage(reciterKey) {
        const reciterImages = {
            "mishari_al_afasy": "images/logo2.png",
            "shuraim": "images/logo2.png",
            "abdul_baset/murattal": "images/logo2.png"
        };
        return reciterImages[reciterKey] || "images/default.jpg";
    };

     // 🔹 Toggle Loop
     loopBtn.addEventListener("click", function () {
        audioPlayer.loop = !audioPlayer.loop;
        this.classList.toggle("active");
    });


    // 🔹 Playback Speed Control
    speedControl.addEventListener("change", function () {
        audioPlayer.playbackRate = parseFloat(this.value);
    });


    document.getElementById("downloadBtn").addEventListener("click", function () {
        const audioPlayer = document.getElementById("audioPlayer");
    
        if (audioPlayer.src && !audioPlayer.src.includes("blob")) {  
            // Create a temporary anchor element
            const link = document.createElement("a");
            link.href = audioPlayer.src;
            
            // Extract Surah name from the currently playing title
            const surahTitle = document.getElementById("nowPlaying").innerText.replace("Now Playing: ", "").trim();
            
            link.download = surahTitle ? `${surahTitle}.mp3` : "surah.mp3"; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("No audio available for download.");
        }
    });
    

    // 🔹 Play Selected Surah
    async function playSurah() {
        const selectedSurah = surahDropdown.value;
        const selectedReciter = reciterDropdown.value;

        if (!selectedSurah || !selectedReciter) {
            alert("Please select both a Surah and a Reciter.");
            return;
        };

        playerImage.src = getReciterImage(selectedReciter);
        const audioURL = await getAudioURL(selectedSurah, selectedReciter);

        if (audioURL) {
            audioPlayer.src = audioURL;
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause-circle"></i>';
            nowPlaying.textContent = `Now Playing: Surah ${selectedSurah} - ${selectedReciter}`;
        } else {
            alert("Audio not found. Please try another reciter.");
        };

        // Load Surah Details and Verses
        loadSurahDetails(selectedSurah);
    };

    // 🔹 Play/Pause Toggle
    playPauseBtn.addEventListener("click", () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause-circle"></i>';
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play-circle"></i>';
        }
    });

    // 🔹 Update Progress Bar


    // Next & Previous Track
    prevTrackBtn.addEventListener("click", () => {
        let currentIndex = parseInt(surahDropdown.value);
        if (currentIndex > 1) {
            surahDropdown.value = currentIndex - 1;
            playSurah();
        }
    });

    nextTrackBtn.addEventListener("click", () => {
        let currentIndex = parseInt(surahDropdown.value);
        if (currentIndex < 114) { // Since there are 114 Surahs
            surahDropdown.value = currentIndex + 1;
            playSurah();
        }
    });

    // Volume Control
    volumeControl.addEventListener("input", () => {
        audioPlayer.volume = volumeControl.value;
    });

    // Progress Bar Update
    audioPlayer.addEventListener("timeupdate", () => {
        let progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        durationDisplay.textContent = formatTime(audioPlayer.duration);
    });

    // Allow Seeking in Progress Bar
    progressBar.addEventListener("input", () => {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
    });
    
    // 🔹 Fetch and Display Verses
    async function loadSurahDetails(surahNumber) {
        if (!surahNumber) return;

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
        } catch (error) {
            console.error("Error fetching Surah details:", error);
        };
    };    


       
        // Mark as Memorized
            document.querySelectorAll(".mark-memorized").forEach(button => {
                button.addEventListener("click", function () {
                    let ayahNumber = parseInt(this.getAttribute("data-ayah"));
                    let currentSurah = surahDropdown.value;
                    let memorizedVerses = JSON.parse(localStorage.getItem(`memorizedSurah${currentSurah}`)) || [];
            
                    if (memorizedVerses.includes(ayahNumber)) {
                        memorizedVerses = memorizedVerses.filter(num => num !== ayahNumber);
                    } else {
                        memorizedVerses.push(ayahNumber);
                    }
            
                    localStorage.setItem(`memorizedSurah${currentSurah}`, JSON.stringify(memorizedVerses));
                    location.reload();
                });
            });


    // 🔹 Load and play Surah on selection change
    surahDropdown.addEventListener("change", playSurah);
    reciterDropdown.addEventListener("change", playSurah);

    // 🔹 Format Time (Helper Function)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };
});

