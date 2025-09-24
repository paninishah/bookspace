// ----- INITIALIZE LOCALSTORAGE -----
if (!localStorage.getItem("favorites")) localStorage.setItem("favorites", JSON.stringify([]));
if (!localStorage.getItem("notes")) localStorage.setItem("notes", JSON.stringify([]));
if (!localStorage.getItem("createdBooks")) localStorage.setItem("createdBooks", JSON.stringify([]));

const favoritesContainer = document.getElementById("favoritesContainer");
const notesContainer = document.getElementById("notesContainer");
const createdBooksContainer = document.getElementById("createdBooksContainer");

// ----- LOAD FAVORITES -----
function loadFavorites() {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favs.length) {
        favoritesContainer.innerHTML = "<p>No favorites yet.</p>";
        return;
    }

    favoritesContainer.innerHTML = favs.map((book, i) => `
        <div class="col-6 col-md-4 col-lg-2 mb-3">
            <div class="card h-100 text-center">
                <img src="${book.cover}" class="card-img-top" style="height:220px; object-fit:cover;">
                <div class="card-body p-2">
                    <p class="card-title small text-truncate mb-0">${book.title}</p>
                    <p class="card-text small text-muted mb-0">${book.author}</p>
                    <button class="btn btn-sm btn-danger remove-fav" data-index="${i}">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

// REMOVE FAVORITE
favoritesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-fav")) {
        let favs = JSON.parse(localStorage.getItem("favorites")) || [];
        favs.splice(e.target.dataset.index, 1);
        localStorage.setItem("favorites", JSON.stringify(favs));
        loadFavorites();
    }
});

// ----- LOAD NOTES -----
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    if (!notes.length) {
        notesContainer.innerHTML = "<p>No notes yet.</p>";
        return;
    }

    notesContainer.innerHTML = notes.map((noteObj, i) => `
        <div class="col-12 col-md-6 col-lg-4 mb-3">
            <div class="card h-100">
                <div class="card-body">
                    <h6 class="card-title">${noteObj.title}</h6>
                    <p class="card-text">${noteObj.note}</p>
                    <button class="btn btn-sm btn-danger delete-note" data-index="${i}">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// DELETE NOTE
notesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-note")) {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.splice(e.target.dataset.index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        loadNotes();
    }
});

// ----- ADD NOTE FROM MODAL -----
document.getElementById("addNote")?.addEventListener("click", () => {
    const title = document.getElementById("bookModalLabel").textContent;
    const note = prompt("Write your note for this book:");
    if (!note) return;

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push({ title, note });
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
    alert("Note saved!");
});

// ----- LOAD CREATED BOOKS -----
function loadCreatedBooks() {
    const created = JSON.parse(localStorage.getItem("createdBooks")) || [];
    if (!created.length) {
        createdBooksContainer.innerHTML = "<p>No books added yet.</p>";
        return;
    }

    createdBooksContainer.innerHTML = created.map((book, i) => `
        <div class="col-6 col-md-4 col-lg-2 mb-3">
            <div class="card h-100 text-center">
                <img src="${book.cover || 'https://via.placeholder.com/150x220?text=No+Cover'}" class="card-img-top" style="height:220px; object-fit:cover;">
                <div class="card-body p-2">
                    <p class="card-title small text-truncate mb-0">${book.title}</p>
                    <p class="card-text small text-muted mb-0">${book.author}</p>
                    <button class="btn btn-sm btn-danger delete-created" data-index="${i}">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// DELETE CREATED BOOK
createdBooksContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-created")) {
        let created = JSON.parse(localStorage.getItem("createdBooks")) || [];
        created.splice(e.target.dataset.index, 1);
        localStorage.setItem("createdBooks", JSON.stringify(created));
        loadCreatedBooks();
    }
});

// ADD NEW CREATED BOOK
document.getElementById("createBookForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("newBookTitle").value.trim();
    const author = document.getElementById("newBookAuthor").value.trim();
    const cover = document.getElementById("newBookCover").value.trim();

    if (!title || !author) return;

    let created = JSON.parse(localStorage.getItem("createdBooks")) || [];
    created.push({ title, author, cover });
    localStorage.setItem("createdBooks", JSON.stringify(created));

    document.getElementById("createBookForm").reset();
    loadCreatedBooks();
});

// ----- ADD TO FAVORITES FROM MODAL -----
document.getElementById("addToFavorites")?.addEventListener("click", () => {
    const title = document.getElementById("bookModalLabel").textContent;
    const author = document.getElementById("bookAuthor").textContent;
    const cover = document.getElementById("bookCover").src;

    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favs.some(b => b.title === title)) {
        favs.push({ title, author, cover });
        localStorage.setItem("favorites", JSON.stringify(favs));
        loadFavorites();
        alert("Added to favorites!");
    } else {
        alert("Already in favorites.");
    }
});

// ----- INITIAL LOAD -----
document.addEventListener("DOMContentLoaded", () => {
    loadFavorites();
    loadNotes();
    loadCreatedBooks();
});
