// Typed effect (if element exists)
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

// Genres and their carousel IDs
const genres = [
    { name: "bestsellers", subject: "bestsellers", carouselId: "bestsellersCarousel" },
    { name: "sci-fi", subject: "science_fiction", carouselId: "scifiCarousel" },
    { name: "romance", subject: "romance", carouselId: "romanceCarousel" },
    { name: "thrillers", subject: "thriller", carouselId: "thrillersCarousel" },
    { name: "adventure", subject: "adventure", carouselId: "adventureCarousel" }
];

// Fetch books from Open Library
async function fetchBooks(subject, limit = 12) {
    try {
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=${limit}`);
        const data = await res.json();
        return data.works || [];
    } catch {
        return [];
    }
}

// Create a carousel item with multiple cards
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

                return `
                    <div class="col-6 col-md-4 col-lg-2 mb-3">
                        <div class="card h-100 text-center" style="max-width:150px; margin:0 auto;">
                            <img src="${cover}" class="card-img-top" alt="${book.title}" style="height:220px; object-fit:cover;">
                            <div class="card-body p-2">
                                <p class="card-title small text-truncate mb-0" title="${book.title}">${book.title}</p>
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

// Populate all carousels (no auto sliding)
async function populateCarousels() {
    for (let genre of genres) {
        const books = await fetchBooks(genre.subject);
        const carouselInner = document.querySelector(`#${genre.carouselId} .carousel-inner`);
        if (!carouselInner) continue;

        carouselInner.innerHTML = '';

        if (books.length) {
            const chunkSize = 6;
            for (let i = 0; i < books.length; i += chunkSize) {
                const carouselItem = createCarouselItem(books.slice(i, i + chunkSize), i === 0);
                carouselInner.appendChild(carouselItem);
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

// Run after DOM loads
document.addEventListener('DOMContentLoaded', populateCarousels);
