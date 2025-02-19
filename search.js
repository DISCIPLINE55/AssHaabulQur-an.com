document.addEventListener("DOMContentLoaded", function () {
    let searchInput = document.getElementById("searchInput");
    let navLinks = document.querySelectorAll(".nav-links li a");
    let searchResultsContainer = document.createElement("ul");

    searchResultsContainer.id = "searchResults";
    searchResultsContainer.style.position = "absolute";
    searchResultsContainer.style.background = "#fff";
    searchResultsContainer.style.border = "1px solid #ccc";
    searchResultsContainer.style.listStyle = "none";
    searchResultsContainer.style.padding = "5px";
    searchResultsContainer.style.display = "none";
    searchResultsContainer.style.zIndex = "1000";

    document.querySelector(".search-container").appendChild(searchResultsContainer);

    searchInput.addEventListener("keyup", function () {
        let input = searchInput.value.toLowerCase();
        searchResultsContainer.innerHTML = "";

        if (input === "") {
            searchResultsContainer.style.display = "none";
            return;
        }

        let matches = [];
        navLinks.forEach(link => {
            let sectionName = link.innerText.toLowerCase();
            let sectionId = link.getAttribute("href").replace("#", "");

            if (sectionName.includes(input)) {
                matches.push({ name: link.innerText, id: sectionId });
            }
        });

        if (matches.length > 0) {
            searchResultsContainer.style.display = "block";
            matches.forEach(match => {
                let listItem = document.createElement("li");
                listItem.textContent = match.name;
                listItem.style.padding = "5px";
                listItem.style.cursor = "pointer";

                listItem.addEventListener("click", function () {
                    window.location.hash = `#${match.id}`;
                    searchResultsContainer.style.display = "none";
                    searchInput.value = "";
                });

                searchResultsContainer.appendChild(listItem);
            });
        } else {
            searchResultsContainer.style.display = "none";
        }
    });

    // Hide search results when clicking outside
    document.addEventListener("click", function (event) {
        if (!searchInput.contains(event.target) && !searchResultsContainer.contains(event.target)) {
            searchResultsContainer.style.display = "none";
        }
    });
});
