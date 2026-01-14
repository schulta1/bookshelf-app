import React, { useState, useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import Shelf from './Shelf';
import BookModal from './BookModal';
import AddBookModal from './AddBookModal';
import { READING_STATUS, STATUS_LABELS } from '../models/Book';
import { 
  getAllBooks, 
  addBook, 
  updateBook, 
  deleteBook, 
  getBooksByStatus 
} from '../services/storage';

/**
 * Bookshelf Component
 * 
 * Main container component that manages the entire bookshelf application.
 * Handles state management, data persistence, and coordination between components.
 */
export default function Bookshelf() {
  // State
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load books from localStorage on mount
  useEffect(() => {
    const loadedBooks = getAllBooks();
    setBooks(loadedBooks);
  }, []);

  // Group books by status
  const wantToRead = books.filter(b => b.status === READING_STATUS.WANT_TO_READ);
  const currentlyReading = books.filter(b => b.status === READING_STATUS.CURRENTLY_READING);
  const read = books.filter(b => b.status === READING_STATUS.READ);

  // Handlers
  const handleAddBook = (book) => {
    addBook(book);
    setBooks(getAllBooks());
  };

  const handleUpdateBook = (bookId, updates) => {
    updateBook(bookId, updates);
    setBooks(getAllBooks());
  };

  const handleDeleteBook = (bookId) => {
    deleteBook(bookId);
    setBooks(getAllBooks());
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-wood-darker shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="bg-amber-warm p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream">
                  My Bookshelf
                </h1>
                <p className="text-cream-dark text-sm hidden sm:block">
                  Track your reading journey
                </p>
              </div>
            </div>

            {/* Add book button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3
                bg-amber-warm hover:bg-amber-glow
                text-white font-semibold rounded-lg
                shadow-md hover:shadow-lg
                transform hover:-translate-y-0.5
                transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Book</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-4 sm:gap-6 text-cream-light text-sm">
            <div>
              <span className="font-semibold">{wantToRead.length}</span> to read
            </div>
            <div>
              <span className="font-semibold">{currentlyReading.length}</span> reading
            </div>
            <div>
              <span className="font-semibold">{read.length}</span> finished
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-8">
        {books.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-wood-light mx-auto mb-4" />
              <h2 className="font-serif text-3xl font-bold text-wood-darker mb-2">
                Your bookshelf is empty
              </h2>
              <p className="text-wood-dark text-lg mb-6">
                Start building your library by adding your first book!
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4
                  bg-amber-warm hover:bg-amber-glow
                  text-white font-semibold rounded-lg text-lg
                  shadow-md hover:shadow-lg
                  transform hover:-translate-y-0.5
                  transition-all duration-300"
              >
                <Plus className="w-6 h-6" />
                Add Your First Book
              </button>
            </div>
          </div>
        ) : (
          // Shelves
          <div className="space-y-4">
            {/* Currently Reading - Show first as it's most active */}
            <Shelf
              title={STATUS_LABELS[READING_STATUS.CURRENTLY_READING]}
              books={currentlyReading}
              onBookClick={handleBookClick}
              emptyMessage="Start reading a book!"
            />

            {/* Want to Read */}
            <Shelf
              title={STATUS_LABELS[READING_STATUS.WANT_TO_READ]}
              books={wantToRead}
              onBookClick={handleBookClick}
              emptyMessage="Add books you want to read"
            />

            {/* Read */}
            <Shelf
              title={STATUS_LABELS[READING_STATUS.READ]}
              books={read}
              onBookClick={handleBookClick}
              emptyMessage="Books you've finished will appear here"
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-wood-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-wood-dark">
          <p className="font-serif">
            Built with React, Vite, and Tailwind CSS
          </p>
        </div>
      </footer>

      {/* Modals */}
      <BookModal
        book={selectedBook}
        onClose={handleCloseModal}
        onUpdate={handleUpdateBook}
        onDelete={handleDeleteBook}
      />

      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBook}
      />
    </div>
  );
}
