/**
 * Data Models for Bookshelf App
 * 
 * These models are designed to be easily migrated to Supabase or Firebase.
 * The structure follows best practices for NoSQL and SQL databases.
 */

// Reading status constants
export const READING_STATUS = {
  WANT_TO_READ: 'want_to_read',
  CURRENTLY_READING: 'currently_reading',
  READ: 'read',
};

// Display names for each status
export const STATUS_LABELS = {
  [READING_STATUS.WANT_TO_READ]: 'Want to Read',
  [READING_STATUS.CURRENTLY_READING]: 'Currently Reading',
  [READING_STATUS.READ]: 'Read',
};

/**
 * Book Interface
 * 
 * @typedef {Object} Book
 * @property {string} id - Unique identifier (UUID format for easy migration)
 * @property {string} title - Book title
 * @property {string} author - Author name
 * @property {string} coverUrl - URL to book cover image
 * @property {string} status - Reading status (one of READING_STATUS values)
 * @property {number|null} rating - Star rating (1-5), null if not rated
 * @property {string} review - User's written review
 * @property {number} createdAt - Timestamp when book was added
 * @property {number} updatedAt - Timestamp when book was last updated
 * @property {number|null} finishedAt - Timestamp when book was finished (for 'read' status)
 */

/**
 * Create a new book object with default values
 * 
 * @param {Partial<Book>} bookData - Partial book data
 * @returns {Book} Complete book object
 */
export function createBook(bookData) {
  const now = Date.now();
  
  return {
    id: bookData.id || generateId(),
    title: bookData.title || '',
    author: bookData.author || '',
    coverUrl: bookData.coverUrl || '',
    status: bookData.status || READING_STATUS.WANT_TO_READ,
    rating: bookData.rating ?? null,
    review: bookData.review || '',
    createdAt: bookData.createdAt || now,
    updatedAt: bookData.updatedAt || now,
    finishedAt: bookData.finishedAt ?? null,
  };
}

/**
 * Generate a unique ID (similar to UUID v4)
 * This format is compatible with most database systems
 * 
 * @returns {string} Unique identifier
 */
export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validate book data
 * 
 * @param {Partial<Book>} bookData - Book data to validate
 * @returns {Object} Validation result { isValid: boolean, errors: string[] }
 */
export function validateBook(bookData) {
  const errors = [];
  
  if (!bookData.title || bookData.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!bookData.author || bookData.author.trim() === '') {
    errors.push('Author is required');
  }
  
  if (bookData.rating !== null && bookData.rating !== undefined) {
    if (bookData.rating < 1 || bookData.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }
  }
  
  if (bookData.status && !Object.values(READING_STATUS).includes(bookData.status)) {
    errors.push('Invalid reading status');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
