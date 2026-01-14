import React from 'react';
import { Star } from 'lucide-react';

/**
 * BookCard Component
 * 
 * Displays a single book as a physical book on a shelf.
 * Handles click events to open the book details modal.
 * 
 * Props:
 * @param {Book} book - The book object to display
 * @param {Function} onClick - Callback when book is clicked
 * @param {number} index - Index for staggered animation
 */
export default function BookCard({ book, onClick, index = 0 }) {
  // Generate a unique color for each book based on title
  // This creates variety in the bookshelf appearance
  const getBookColor = (title) => {
    const colors = [
      'from-rose-600 to-rose-800',
      'from-blue-600 to-blue-800',
      'from-green-600 to-green-800',
      'from-purple-600 to-purple-800',
      'from-amber-600 to-amber-800',
      'from-teal-600 to-teal-800',
      'from-indigo-600 to-indigo-800',
      'from-pink-600 to-pink-800',
      'from-emerald-600 to-emerald-800',
      'from-orange-600 to-orange-800',
    ];
    
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div
      className="animate-book-appear cursor-pointer group"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={onClick}
    >
      {/* Book container with 3D effect */}
      <div className="relative transform transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105">
        {/* Book cover */}
        <div className={`
          w-32 h-48 sm:w-36 sm:h-52 md:w-40 md:h-56
          rounded-sm shadow-book group-hover:shadow-book-hover
          transition-all duration-300
          book-spine
          flex flex-col justify-between
          p-3 sm:p-4
          bg-gradient-to-br ${book.coverUrl ? '' : getBookColor(book.title)}
          relative overflow-hidden
        `}>
          {/* Book cover image if provided */}
          {book.coverUrl ? (
            <img 
              src={book.coverUrl} 
              alt={book.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              {/* Title on book spine */}
              <div className="relative z-10">
                <h3 className="font-serif font-semibold text-white text-sm sm:text-base leading-tight line-clamp-3">
                  {book.title}
                </h3>
              </div>
              
              {/* Author at bottom */}
              <div className="relative z-10">
                <p className="font-sans text-xs text-white/90 line-clamp-2">
                  {book.author}
                </p>
              </div>
            </>
          )}
          
          {/* Rating indicator if book is rated */}
          {book.rating && (
            <div className="absolute top-2 right-2 z-10 bg-amber-glow/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 fill-white text-white" />
              <span className="text-xs font-semibold text-white">
                {book.rating}
              </span>
            </div>
          )}
          
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        </div>
        
        {/* Book shadow on shelf */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-2 bg-black/20 blur-md rounded-full" />
      </div>
    </div>
  );
}
