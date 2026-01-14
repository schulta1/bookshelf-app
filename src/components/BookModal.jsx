import React, { useState, useEffect } from 'react';
import { X, Trash2, MoveRight } from 'lucide-react';
import StarRating from './StarRating';
import { READING_STATUS, STATUS_LABELS } from '../models/Book';

/**
 * BookModal Component
 * 
 * Modal for viewing and editing book details.
 * Allows updating status, rating, and review.
 * Includes delete functionality.
 * 
 * Props:
 * @param {Book|null} book - Book to display (null to close modal)
 * @param {Function} onClose - Callback to close modal
 * @param {Function} onUpdate - Callback when book is updated
 * @param {Function} onDelete - Callback when book is deleted
 */
export default function BookModal({ book, onClose, onUpdate, onDelete }) {
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState('');
  const [status, setStatus] = useState(READING_STATUS.WANT_TO_READ);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize form when book changes
  useEffect(() => {
    if (book) {
      setRating(book.rating);
      setReview(book.review || '');
      setStatus(book.status);
    }
  }, [book]);

  // Don't render if no book
  if (!book) return null;

  const handleSave = () => {
    onUpdate(book.id, {
      rating,
      review,
      status,
      finishedAt: status === READING_STATUS.READ && book.status !== READING_STATUS.READ
        ? Date.now()
        : book.finishedAt,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(book.id);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-0 md:p-4"
      onClick={handleBackdropClick}
    >
      {/* Modal content - bottom sheet on mobile, centered on desktop */}
      <div className="
        bg-cream-light rounded-t-3xl md:rounded-3xl 
        w-full md:max-w-2xl md:max-h-[90vh]
        shadow-2xl animate-slide-up
        overflow-y-auto custom-scrollbar
      ">
        {/* Header */}
        <div className="sticky top-0 bg-cream-light border-b border-wood-light px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-wood-darker">Book Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-wood-light/30 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-wood-dark" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Book info */}
          <div className="flex gap-6">
            {/* Book cover */}
            <div className="flex-shrink-0">
              <div className={`
                w-32 h-48 rounded-sm shadow-book
                ${book.coverUrl ? '' : 'bg-gradient-to-br from-blue-600 to-blue-800'}
                flex items-center justify-center
                overflow-hidden
              `}>
                {book.coverUrl ? (
                  <img 
                    src={book.coverUrl} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center px-4">
                    <p className="font-serif font-semibold text-white text-sm">
                      {book.title}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Title and author */}
            <div className="flex-1">
              <h3 className="font-serif text-2xl font-bold text-wood-darker mb-2">
                {book.title}
              </h3>
              <p className="text-lg text-wood-dark mb-4">
                by {book.author}
              </p>

              {/* Reading status selector */}
              <div>
                <label className="block text-sm font-semibold text-wood-dark mb-2">
                  Reading Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-wood-light bg-white
                    text-wood-darker font-medium
                    focus:outline-none focus:ring-2 focus:ring-amber-warm
                    transition-all"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-wood-dark mb-2">
              Your Rating
            </label>
            <StarRating
              rating={rating}
              onChange={setRating}
              size="lg"
            />
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm font-semibold text-wood-dark mb-2">
              Your Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you think about this book?"
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-wood-light bg-white
                text-wood-darker placeholder-wood-light
                focus:outline-none focus:ring-2 focus:ring-amber-warm
                transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-amber-warm hover:bg-amber-glow
                text-white font-semibold rounded-lg
                shadow-md hover:shadow-lg
                transform hover:-translate-y-0.5
                transition-all duration-300"
            >
              Save Changes
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700
                text-white font-semibold rounded-lg
                shadow-md hover:shadow-lg
                transform hover:-translate-y-0.5
                transition-all duration-300
                flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>

        {/* Delete confirmation overlay */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-cream-light rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-serif text-xl font-bold text-wood-darker mb-2">
                Delete this book?
              </h3>
              <p className="text-wood-dark mb-6">
                This action cannot be undone. The book and all its data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-wood-light hover:bg-wood
                    text-wood-darker font-semibold rounded-lg
                    transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700
                    text-white font-semibold rounded-lg
                    transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
