/**
 * Sample Data
 * 
 * Example books to populate your bookshelf for testing.
 * 
 * To use this data:
 * 1. Import this file in your component
 * 2. Call populateSampleData() to add these books
 * 
 * Or manually add through the UI!
 */

import { createBook, READING_STATUS } from './models/Book';
import { addBook } from './services/storage';

export const sampleBooks = [
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg',
    status: READING_STATUS.READ,
    rating: 5,
    review: 'A beautiful exploration of life choices and parallel universes. Made me think about all the paths I could have taken.',
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1597695864i/54493401.jpg',
    status: READING_STATUS.CURRENTLY_READING,
    rating: null,
    review: '',
  },
  {
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1664729357i/32620332.jpg',
    status: READING_STATUS.READ,
    rating: 5,
    review: 'Absolutely captivating! Could not put this book down. The characters felt so real and alive.',
  },
  {
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1636978687i/58784475.jpg',
    status: READING_STATUS.WANT_TO_READ,
    rating: null,
    review: '',
  },
  {
    title: 'Fourth Wing',
    author: 'Rebecca Yarros',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1701980900i/61431922.jpg',
    status: READING_STATUS.CURRENTLY_READING,
    rating: 4,
    review: 'Great dragon fantasy! The romance is a bit much but the world-building is fantastic.',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg',
    status: READING_STATUS.READ,
    rating: 5,
    review: 'Life-changing approach to building good habits. Practical and backed by research.',
  },
  {
    title: 'The Invisible Life of Addie LaRue',
    author: 'V.E. Schwab',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1584633432i/50623864.jpg',
    status: READING_STATUS.WANT_TO_READ,
    rating: null,
    review: '',
  },
  {
    title: 'A Court of Thorns and Roses',
    author: 'Sarah J. Maas',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1619549650i/16096824.jpg',
    status: READING_STATUS.WANT_TO_READ,
    rating: null,
    review: '',
  },
  {
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1352083600i/13623848.jpg',
    status: READING_STATUS.READ,
    rating: 5,
    review: 'Beautifully written retelling of the Iliad. Patroclus and Achilles\' relationship is so moving.',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793965i/11468377.jpg',
    status: READING_STATUS.WANT_TO_READ,
    rating: null,
    review: '',
  },
];

/**
 * Populate the bookshelf with sample data
 * WARNING: This will add books to your existing collection
 */
export function populateSampleData() {
  sampleBooks.forEach(bookData => {
    const book = createBook(bookData);
    addBook(book);
  });
  
  console.log(`Added ${sampleBooks.length} sample books to your bookshelf!`);
}

/**
 * To use this in your app, uncomment the following in Bookshelf.jsx:
 * 
 * import { populateSampleData } from '../sampleData';
 * 
 * // In useEffect:
 * useEffect(() => {
 *   const loadedBooks = getAllBooks();
 *   
 *   // Populate with sample data if bookshelf is empty
 *   if (loadedBooks.length === 0) {
 *     populateSampleData();
 *     setBooks(getAllBooks());
 *   } else {
 *     setBooks(loadedBooks);
 *   }
 * }, []);
 */
