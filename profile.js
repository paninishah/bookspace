//localstorage
if (!localStorage.getItem("favorites")) localStorage.setItem("favorites", JSON.stringify([]));
if (!localStorage.getItem("notes")) localStorage.setItem("notes", JSON.stringify([]));
if (!localStorage.getItem("createdBooks")) localStorage.setItem("createdBooks", JSON.stringify([]));

const favoritesContainer = document.getElementById("favoritesContainer");
const notesContainer = document.getElementById("notesContainer");
const createdBooksContainer = document.getElementById("createdBooksContainer");

function loadFavorites() {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favs.length) {
        favoritesContainer.innerHTML = "<p>no favourites yet.</p>";
        return;
    }

    favoritesContainer.innerHTML = favs.map((book, i) => `
        <div class="col-6 col-md-4 col-lg-2 mb-3">
            <div class="card h-100 text-center">
                <img src="${book.cover}" class="card-img-top" style="height:220px; object-fit:cover;">
                <div class="card-body p-2">
                    <p class="card-title small text-truncate mb-0">${book.title}</p>
                    <p class="card-text small text-muted mb-0">${book.author}</p>
                    <button class="btn btn-sm btn-danger remove-fav" data-index="${i}">i dont like this anymore :(</button>
                </div>
            </div>
        </div>
    `).join('');
}

//delete
favoritesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-fav")) {
        let favs = JSON.parse(localStorage.getItem("favorites")) || [];
        favs.splice(e.target.dataset.index, 1);
        localStorage.setItem("favorites", JSON.stringify(favs));
        loadFavorites();
    }
});

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    if (!notes.length) {
        notesContainer.innerHTML = "<p>you haven't noted anything yet.</p>";
        return;
    }

    notesContainer.innerHTML = notes.map((noteObj, i) => `
        <div class="col-12 col-md-6 col-lg-4 mb-3">
            <div class="card h-100">
                <div class="card-body">
                    <h6 class="card-title">${noteObj.title}</h6>
                    <p class="card-text">${noteObj.note}</p>
                    <button class="btn btn-sm btn-danger delete-note" data-index="${i}">delete note</button>
                </div>
            </div>
        </div>
    `).join('');
}

//delete
notesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-note")) {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        notes.splice(e.target.dataset.index, 1);
        localStorage.setItem("notes", JSON.stringify(notes));
        loadNotes();
    }
});

//add note when modal button 
document.getElementById("addNote")?.addEventListener("click", () => {
    const title = document.getElementById("bookModalLabel").textContent;
    const note = prompt("write your notes:");
    if (!note) return;

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push({ title, note });
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
    alert("got it!");
});


function loadCreatedBooks() {
    const created = JSON.parse(localStorage.getItem("createdBooks")) || [];
    if (!created.length) {
        createdBooksContainer.innerHTML = "<p>no books created yet.</p>";
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

//delete
createdBooksContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-created")) {
        let created = JSON.parse(localStorage.getItem("createdBooks")) || [];
        created.splice(e.target.dataset.index, 1);
        localStorage.setItem("createdBooks", JSON.stringify(created));
        loadCreatedBooks();
    }
});

//add created book to profile
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

//add to favs from modal button
document.getElementById("addToFavorites")?.addEventListener("click", () => {
    const title = document.getElementById("bookModalLabel").textContent;
    const author = document.getElementById("bookAuthor").textContent;
    const cover = document.getElementById("bookCover").src;

    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favs.some(b => b.title === title)) {
        favs.push({ title, author, cover });
        localStorage.setItem("favorites", JSON.stringify(favs));
        loadFavorites();
        alert("added to favs!");
    } else {
        alert("you like this lots it seems (it's already in your favourites)");
    }
});

// ----- INITIAL LOAD -----
document.addEventListener("DOMContentLoaded", () => {
    loadFavorites();
    loadNotes();
    loadCreatedBooks();
});
