import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';

/**
 * Shelf Component
 * 
 * Displays a wooden shelf containing books.
 * Supports horizontal scrolling on mobile and grid layout on desktop.
 * 
 * Props:
 * @param {string} title - Shelf title (e.g., "Currently Reading")
 * @param {Array<Book>} books - Array of books to display
 * @param {Function} onBookClick - Callback when a book is clicked
 * @param {string} emptyMessage - Message to show when shelf is empty
 */
export default function Shelf({ title, books, onBookClick, emptyMessage = 'No books yet' }) {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const scrollContainer = scrollContainerRef.current;
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [books]);

  // Scroll left/right on arrow click
  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 300;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + 
      (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  return (
    <div className="mb-12 animate-fade-in">
      {/* Shelf title */}
      <div className="mb-4 px-4 md:px-8">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-wood-darker">
          {title}
        </h2>
        <div className="h-1 w-20 bg-amber-warm rounded-full mt-2" />
      </div>

      {/* Shelf container with wood texture */}
      <div className="relative">
        {/* Left scroll arrow (mobile) */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 md:hidden
              bg-wood-dark/90 hover:bg-wood-darker text-white rounded-full p-2
              shadow-lg transition-all duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right scroll arrow (mobile) */}
        {showRightArrow && books.length > 0 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 md:hidden
              bg-wood-dark/90 hover:bg-wood-darker text-white rounded-full p-2
              shadow-lg transition-all duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Wooden shelf */}
        <div className="wood-texture rounded-lg shadow-shelf px-4 py-6 md:px-8 md:py-8">
          {books.length === 0 ? (
            // Empty state
            <div className="flex items-center justify-center min-h-[200px] md:min-h-[250px]">
              <p className="text-wood-dark text-lg font-serif italic">
                {emptyMessage}
              </p>
            </div>
          ) : (
            // Books container
            <div
              ref={scrollContainerRef}
              className="
                flex md:grid
                gap-6 md:gap-8
                overflow-x-auto md:overflow-x-visible
                scrollbar-hide md:custom-scrollbar
                md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
                pb-2
              "
            >
              {books.map((book, index) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => onBookClick(book)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Shelf edge shadow */}
        <div className="h-3 bg-gradient-to-b from-wood-darker/30 to-transparent rounded-b-lg" />
      </div>
    </div>
  );
}
