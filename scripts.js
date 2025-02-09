import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
import { BookPreview } from './bookPreview.js'

customElements.define('book-preview', BookPreview);


const Book = {
    /**
     * Creates an HTML element representing a book preview.
     * @param {object} book - The book object containing details like id, image, title, and author.
     * @param {string} book.id - The unique identifier for the book.
     * @param {string} book.image - The image URL of the book cover.
     * @param {string} book.title - The title of the book.
     * @param {string} book.author - The author identifier of the book (used to fetch author's name).
     * @returns {HTMLElement} The created book preview element.
     */

createElement: (book) => {
    const element = document.createElement('button');
    element.classList = 'preview'
    element.setAttribute('data-preview', book.id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${book.image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${book.title}</h3>
            <div class="preview__author">${authors[book.author]}</div>
        </div>
    `
    return element;
}
};
/**
 * Toggles between dark and light themes for the document.
 * @param {string} theme - The theme to apply. Can be 'night' for dark mode or 'day' for light mode.
 */
    const toggleTheme = (theme) => {
        const darkMode = theme === 'night';
        document.documentElement.style.setProperty('--color-dark', darkMode ? '255, 255, 255' : '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', darkMode ? '10, 10, 20' : '255, 255, 255');
        document.querySelector('[data-settings-theme]').value = darkMode ? 'night' : 'day';
    };
        toggleTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day');

/**
 * Handles population of a dropdown element with options.
 * @param {string} selector - The selector for the dropdown element.
 * @param {Object} data - A key-value pair of the data to populate the dropdown. Keys are option values, values are the option text.
 * @param {string} defaultOption - The default option text for the dropdown.
 */
const Dropdown = {
 
    populate: (selector, data, defaultOption) => {
        const fragment = document.createDocumentFragment();
        const firstOption = document.createElement('option');
        firstOption.value = 'any';
        firstOption.innerText = defaultOption;
        fragment.appendChild(firstOption);

        Object.entries(data).forEach(([id, name]) => {
            const option = document.createElement('option');
            option.value = id;
            option.innerText = name;
            fragment.appendChild(option);
        });

        document.querySelector(selector).appendChild(fragment);
    }
};

const bookList = {
    page: 1,
    matches: books,
    
/** 
* Renders a list of books to the DOM.
* @param {object[]} renderBooks - An array of book objects to render. Each book should contain `id`, `image`, `title`, and `author`.
*/
    
    render: (renderBooks) => {
        const fragment = document.createDocumentFragment();
        renderBooks.forEach(book => {
        fragment.appendChild(Book.createElement(book));
        });
    document.querySelector('[data-list-items]').appendChild(fragment);
    },

    /**
     * Filters the books based on provided filters (genre, title, author).
     * @param {Object} filters - The filters applied to the books.
     * @param {string} filters.genre - The selected genre for filtering. Can be 'any' to ignore this filter.
     * @param {string} filters.title - The search term for filtering books by title.
     * @param {string} filters.author - The selected author for filtering. Can be 'any' to ignore this filter.
     */
    
    filterBooks: (filters) => {
    bookList.matches = books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        return titleMatch && authorMatch && genreMatch;
    });
    bookList.page = 1;
},

    /**
     * Updates the "Show More" button based on the number of remaining books to display.
     */
    updateShowMoreButton: () => {
    const remainingBooks = bookList.matches.length - (bookList.page * BOOKS_PER_PAGE);
    const showMoreButton = document.querySelector('[data-list-button]');
    showMoreButton.innerText = `show more (${remainingBooks})`;
    showMoreButton.disabled = remainingBooks <= 0;
    showMoreButton.innerHTML = `
    <span>show more</span>
    <span class="list__remaining">(${remainingBooks > 0 ? remainingBooks : 0})</span>
    `;
}
};
// initialize Dropdowns and book list
Dropdown.populate('[data-search-genres]', genres, 'All Genres');
Dropdown.populate('[data-search-authors]', authors, 'All Authors');
bookList.render(bookList.matches.slice(0, BOOKS_PER_PAGE));
bookList.updateShowMoreButton();

// Event listeners
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
});

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
});

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
});

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
});

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)
    toggleTheme(theme);
    document.querySelector('[data-settings-overlay]').open = false;
});



document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    bookList.filterBooks(filters);

    const notFound = bookList.matches.length === 0;
    document.querySelector('[data-list-message]').classList.toggle('list__message_show', notFound);
    document.querySelector('[data-list-items]').innerHTML = '';
    bookList.render(bookList.matches.slice(0, BOOKS_PER_PAGE));
    bookList.updateShowMoreButton();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('[data-search-overlay]').open = false;
});

document.querySelector('[data-list-button]').addEventListener('click', () => {
const bookNextPage = bookList.matches.slice(bookList.page * BOOKS_PER_PAGE, (bookList.page + 1) * BOOKS_PER_PAGE);
bookList.render(bookNextPage);
bookList.page += 1;
bookList.updateShowMoreButton();
});

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-preview]');
    if (button) {
        const bookId = button.dataset.preview
        const book = books.find(book => book.id === bookId);

    if (book) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = book.image
        document.querySelector('[data-list-image]').src = book.image
        document.querySelector('[data-list-title]').innerText = book.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = book.description
    }
}
});