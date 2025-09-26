//to use typed ONLY if it exists on the page 
const typedElement = document.querySelector("#typed");
if (typedElement) {
    new Typed("#typed", {
        strings: ["read", "explore", "discover", "escape", "dream"],
        typeSpeed: 150,
        backSpeed: 100,
        backDelay: 1200,
        loop: true
    });
}

//carousel names
const genres = [
    { name: "bestsellers", subject: "bestsellers", carouselId: "bestsellersCarousel" },
    { name: "sci-fi", subject: "science_fiction", carouselId: "scifiCarousel" },
    { name: "romance", subject: "romance", carouselId: "romanceCarousel" },
    { name: "thrillers", subject: "thriller", carouselId: "thrillersCarousel" },
    { name: "adventure", subject: "adventure", carouselId: "adventureCarousel" }
];

async function fetchBooks(subject, limit = 10) {
    try {
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=${limit}`);
        const data = await res.json();
        return data.works || [];
    } catch (err) {
        console.error(`Error fetching ${subject}:`, err);
        return [];
    }
}

function createCarouselItem(books, isActive = false) {
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    if (isActive) item.classList.add("active");

    item.innerHTML = `
        <div class="row justify-content-center">
            ${books.map(book => {
                const cover = book.cover_id 
                    ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                    : "https://via.placeholder.com/150x220?text=No+Cover";
                const author = book.authors?.[0]?.name || "Unknown Author";
                const title = book.title || "Unknown Title";

                return `
                    <div class="col-6 col-md-4 col-lg-2 mb-3">
                        <div class="card h-100 text-center book-card" 
                             style="max-width:150px; margin:0 auto; cursor:pointer;"
                             data-title="${title}"
                             data-author="${author}"
                             data-cover="${cover}">
                            <img src="${cover}" class="card-img-top" alt="${title}" style="height:220px; object-fit:cover;">
                            <div class="card-body p-2">
                                <p class="card-title small text-truncate mb-0" title="${title}">${title}</p>
                                <p class="card-text small text-muted mb-0">${author}</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    return item;
}

//add books to carousel
async function populateCarousels() {
    for (let genre of genres) {
        const books = await fetchBooks(genre.subject);
        const carouselInner = document.querySelector(`#${genre.carouselId} .carousel-inner`);
        if (!carouselInner) continue;

        carouselInner.innerHTML = '';

        if (books.length) {
            const chunkSize = 6;
            for (let i = 0; i < books.length; i += chunkSize) {
                const item = createCarouselItem(books.slice(i, i + chunkSize), i === 0);
                carouselInner.appendChild(item);
            }
        } else {
            carouselInner.innerHTML = `
                <div class="carousel-item active">
                    <div class="text-center py-5">
                        <p>Unable to load ${genre.name} books.</p>
                    </div>
                </div>
            `;
        }
    }
}

document.addEventListener("DOMContentLoaded", populateCarousels);

//search stuff
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const carouselContainer = document.getElementById("carouselContainer");

const searchResultsContainer = document.createElement("div");
searchResultsContainer.id = "searchResults";
searchResultsContainer.classList.add("container", "mt-4");
searchResultsContainer.style.display = "none";
document.body.appendChild(searchResultsContainer);

const clearSearchContainer = document.createElement("div");
clearSearchContainer.id = "clearSearchContainer";
clearSearchContainer.classList.add("container", "mt-2", "text-center");
clearSearchContainer.style.display = "none";
clearSearchContainer.innerHTML = `
    <button type="button" class="btn btn-secondary" id="clearSearchBtn">
        back to home
    </button>
`;
document.body.appendChild(clearSearchContainer);

searchForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    carouselContainer.style.display = "none";
    searchResultsContainer.style.display = "block";
    clearSearchContainer.style.display = "block";
    searchResultsContainer.innerHTML = `<p class="text-center py-3">Searching for "${query}"...</p>`;

    try {
        const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`);
        const data = await res.json();
        const books = data.docs;

        if (!books.length) {
            searchResultsContainer.innerHTML = `<p class="text-center py-3">No results found for "${query}".</p>`;
            return;
        }

        const booksHtml = books.map(book => {
            const cover = book.cover_i 
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
                : "https://via.placeholder.com/150x220?text=No+Cover";
            const title = book.title || "Unknown Title";
            const author = book.author_name?.[0] || "Unknown Author";

            return `
                <div class="col-6 col-md-4 col-lg-2 mb-3">
                    <div class="card h-100 text-center book-card"
                         style="max-width:150px; margin:0 auto; cursor:pointer;"
                         data-title="${title}"
                         data-author="${author}"
                         data-cover="${cover}">
                        <img src="${cover}" class="card-img-top" alt="${title}" style="height:220px; object-fit:cover;">
                        <div class="card-body p-2">
                            <p class="card-title small text-truncate mb-0" title="${title}">${title}</p>
                            <p class="card-text small text-muted mb-0">${author}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        searchResultsContainer.innerHTML = `<div class="row justify-content-center">${booksHtml}</div>`;
    } catch (err) {
        searchResultsContainer.innerHTML = `<p class="text-center py-3">Error fetching search results.</p>`;
        console.error(err);
    }
});

document.addEventListener("click", (e) => {
    if (e.target.id === "clearSearchBtn") {
        carouselContainer.style.display = "block";
        searchResultsContainer.style.display = "none";
        clearSearchContainer.style.display = "none";
        searchInput.value = "";
    }
});

//modal button interactions
document.addEventListener("click", (e) => {
    const card = e.target.closest(".book-card");
    if (card) {
        document.getElementById("bookModalLabel").textContent = card.dataset.title;
        document.getElementById("bookAuthor").textContent = card.dataset.author;
        document.getElementById("bookCover").src = card.dataset.cover;
        document.getElementById("bookDescription").textContent = "(book description)";

        const modal = new bootstrap.Modal(document.getElementById("bookModal"));
        modal.show();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const addToFavoritesBtn = document.getElementById("addToFavorites");
    const addNoteBtn = document.getElementById("addNote");

    addToFavoritesBtn?.addEventListener("click", () => {
        const title = document.getElementById("bookModalLabel").textContent;
        const author = document.getElementById("bookAuthor").textContent;
        const cover = document.getElementById("bookCover").src;

        let favs = JSON.parse(localStorage.getItem("favorites")) || [];
        if (!favs.some(b => b.title === title)) {
            favs.push({ title, author, cover });
            localStorage.setItem("favorites", JSON.stringify(favs));
            alert("Added to favorites!");
        } else alert("Already in favorites.");
    });

    addNoteBtn?.addEventListener("click", () => {
        const title = document.getElementById("bookModalLabel").textContent;
        const note = prompt("Write your note for this book:");
        if (!note) return;

        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.push({ title, note });
        localStorage.setItem("notes", JSON.stringify(notes));
        alert("Note saved!");
    });
});
