import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { READING_STATUS, STATUS_LABELS, createBook, validateBook } from '../models/Book';

/**
 * AddBookModal Component
 * 
 * Modal form for adding a new book to the collection.
 * Validates input before submission.
 * 
 * Props:
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Callback to close modal
 * @param {Function} onAdd - Callback when book is added
 */
export default function AddBookModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverUrl: '',
    status: READING_STATUS.WANT_TO_READ,
  });
  const [errors, setErrors] = useState([]);

  // Don't render if not open
  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateBook(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Create and add book
    const newBook = createBook(formData);
    onAdd(newBook);

    // Reset form and close
    setFormData({
      title: '',
      author: '',
      coverUrl: '',
      status: READING_STATUS.WANT_TO_READ,
    });
    setErrors([]);
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
      {/* Modal content */}
      <div className="
        bg-cream-light rounded-t-3xl md:rounded-3xl 
        w-full md:max-w-lg
        shadow-2xl animate-slide-up
        overflow-y-auto custom-scrollbar
      ">
        {/* Header */}
        <div className="sticky top-0 bg-cream-light border-b border-wood-light px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-wood-darker">Add New Book</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-wood-light/30 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-wood-dark" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-300 rounded-lg p-4">
              <p className="font-semibold text-red-800 mb-1">Please fix the following:</p>
              <ul className="list-disc list-inside text-red-700 text-sm">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-wood-dark mb-2">
              Book Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter book title"
              className="w-full px-4 py-3 rounded-lg border border-wood-light bg-white
                text-wood-darker placeholder-wood-light
                focus:outline-none focus:ring-2 focus:ring-amber-warm
                transition-all"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold text-wood-dark mb-2">
              Author <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder="Enter author name"
              className="w-full px-4 py-3 rounded-lg border border-wood-light bg-white
                text-wood-darker placeholder-wood-light
                focus:outline-none focus:ring-2 focus:ring-amber-warm
                transition-all"
              required
            />
          </div>

          {/* Cover URL */}
          <div>
            <label className="block text-sm font-semibold text-wood-dark mb-2">
              Cover Image URL <span className="text-xs text-wood">(optional)</span>
            </label>
            <input
              type="url"
              value={formData.coverUrl}
              onChange={(e) => handleChange('coverUrl', e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="w-full px-4 py-3 rounded-lg border border-wood-light bg-white
                text-wood-darker placeholder-wood-light
                focus:outline-none focus:ring-2 focus:ring-amber-warm
                transition-all"
            />
            <p className="text-xs text-wood-dark mt-1">
              Leave empty to use a colorful placeholder
            </p>
          </div>

          {/* Reading status */}
          <div>
            <label className="block text-sm font-semibold text-wood-dark mb-2">
              Reading Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-wood-light bg-white
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

          {/* Submit button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-amber-warm hover:bg-amber-glow
              text-white font-semibold rounded-lg
              shadow-md hover:shadow-lg
              transform hover:-translate-y-0.5
              transition-all duration-300
              flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Book to Shelf
          </button>
        </form>
      </div>
    </div>
  );
}
