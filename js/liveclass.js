document.addEventListener("DOMContentLoaded", function () {
    // Ensure SweetAlert2 is loaded
    if (typeof Swal === "undefined") {
        alert("Error: SweetAlert2 not loaded. Check your internet connection.");
        return;
    }

    const joinButton = document.querySelector("#live-studies button");

    // Set Live & Watch Later Links (Replace with actual URLs)
    const liveClassLink = "https://your-live-class-link.com";
    const watchLaterLink = "https://your-recorded-classes.com";

    joinButton.addEventListener("click", function () {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 6 = Saturday
        const hour = now.getHours();
        const minutes = now.getMinutes();

        const startHour = 16; // 4:30 PM
        const startMinutes = 30;
        const endHour = 18; // 6:00 PM
        const endMinutes = 0;

        const isLiveClassDay = (day === 6 || day === 0);
        const isLiveClassTime = (hour > startHour || (hour === startHour && minutes >= startMinutes)) &&
                                (hour < endHour || (hour === endHour && minutes <= endMinutes));

        if (isLiveClassDay && isLiveClassTime) {
            Swal.fire({
                title: "Live Class Available 🎥",
                text: "The live class is currently ongoing. Do you want to join?",
                icon: "success",
                showCancelButton: true,
                confirmButtonText: "Join Now",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#009688",
                cancelButtonColor: "#d33",
            }).then((result) => {
                if (result.isConfirmed) {
                    joinButton.innerText = "Connecting...";
                    joinButton.disabled = true;
                    setTimeout(() => {
                        window.location.href = liveClassLink;
                    }, 2000);
                }
            });
        } else {
            Swal.fire({
                title: "Live Class Unavailable ⏳",
                text: "Live classes are only available on Saturdays & Sundays from 4:30 PM - 6:00 PM. Would you like to watch a recorded session?",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Watch Later",
                cancelButtonText: "Close",
                confirmButtonColor: "#009688",
                cancelButtonColor: "#d33",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = watchLaterLink;
                }
            });
        }
    });
});






document.addEventListener("DOMContentLoaded", function () {
    const enrollButtons = document.querySelectorAll(".enroll-btn");

    enrollButtons.forEach((button) => {
        button.addEventListener("click", function () {
            Swal.fire({
                title: "Enroll in Course",
                text: "Would you like to enroll in this course?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, Enroll",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#009688",
                cancelButtonColor: "#d33",
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Success!",
                        text: "You have been enrolled successfully.",
                        icon: "success",
                        confirmButtonColor: "#009688",
                    });
                }
            });
        });
    });
});
