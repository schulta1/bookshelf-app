/**
 * LocalStorage Service
 * 
 * Manages data persistence using browser's localStorage.
 * Designed to be easily swapped with Firebase/Supabase in the future.
 * 
 * Migration Notes:
 * - Replace localStorage calls with database queries
 * - Add user authentication and filter by userId
 * - Implement real-time subscriptions for multi-device sync
 */

const STORAGE_KEY = 'bookshelf_books';

/**
 * Get all books from localStorage
 * 
 * @returns {Array<Book>} Array of book objects
 */
export function getAllBooks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const books = JSON.parse(stored);
    return Array.isArray(books) ? books : [];
  } catch (error) {
    console.error('Error loading books from localStorage:', error);
    return [];
  }
}

/**
 * Save all books to localStorage
 * 
 * @param {Array<Book>} books - Array of book objects
 * @returns {boolean} Success status
 */
export function saveBooks(books) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    return true;
  } catch (error) {
    console.error('Error saving books to localStorage:', error);
    return false;
  }
}

/**
 * Add a new book
 * 
 * @param {Book} book - Book object to add
 * @returns {Book} The added book
 */
export function addBook(book) {
  const books = getAllBooks();
  books.push(book);
  saveBooks(books);
  return book;
}

/**
 * Update an existing book
 * 
 * @param {string} bookId - ID of the book to update
 * @param {Partial<Book>} updates - Fields to update
 * @returns {Book|null} Updated book or null if not found
 */
export function updateBook(bookId, updates) {
  const books = getAllBooks();
  const index = books.findIndex(b => b.id === bookId);
  
  if (index === -1) return null;
  
  books[index] = {
    ...books[index],
    ...updates,
    updatedAt: Date.now(),
  };
  
  saveBooks(books);
  return books[index];
}

/**
 * Delete a book
 * 
 * @param {string} bookId - ID of the book to delete
 * @returns {boolean} Success status
 */
export function deleteBook(bookId) {
  const books = getAllBooks();
  const filtered = books.filter(b => b.id !== bookId);
  
  if (filtered.length === books.length) return false;
  
  saveBooks(filtered);
  return true;
}

/**
 * Get books by reading status
 * 
 * @param {string} status - Reading status to filter by
 * @returns {Array<Book>} Filtered array of books
 */
export function getBooksByStatus(status) {
  const books = getAllBooks();
  return books.filter(b => b.status === status);
}

/**
 * Clear all books (useful for testing or reset)
 * 
 * @returns {boolean} Success status
 */
export function clearAllBooks() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing books:', error);
    return false;
  }
}

/**
 * Export books as JSON (for backup or migration)
 * 
 * @returns {string} JSON string of all books
 */
export function exportBooks() {
  const books = getAllBooks();
  return JSON.stringify(books, null, 2);
}

/**
 * Import books from JSON (for backup restore or migration)
 * 
 * @param {string} jsonString - JSON string of books
 * @returns {boolean} Success status
 */
export function importBooks(jsonString) {
  try {
    const books = JSON.parse(jsonString);
    if (!Array.isArray(books)) {
      throw new Error('Invalid format: expected array of books');
    }
    
    saveBooks(books);
    return true;
  } catch (error) {
    console.error('Error importing books:', error);
    return false;
  }
}
