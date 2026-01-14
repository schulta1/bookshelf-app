import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating Component
 * 
 * Interactive star rating input (1-5 stars).
 * Supports hover preview and click to select.
 * 
 * Props:
 * @param {number|null} rating - Current rating value (1-5 or null)
 * @param {Function} onChange - Callback when rating changes
 * @param {boolean} readonly - If true, stars are not interactive
 * @param {string} size - Size of stars ('sm', 'md', 'lg')
 */
export default function StarRating({ 
  rating, 
  onChange, 
  readonly = false,
  size = 'md' 
}) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const starSize = sizeClasses[size] || sizeClasses.md;

  const handleClick = (value) => {
    if (readonly) return;
    
    // Allow clicking the same rating to clear it
    if (rating === value) {
      onChange(null);
    } else {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoveredRating(value);
    }
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || rating || 0;

  return (
    <div 
      className="flex items-center gap-1"
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          disabled={readonly}
          className={`
            transition-all duration-200
            ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
            ${hoveredRating === value ? 'scale-110' : ''}
          `}
          aria-label={`${value} star${value !== 1 ? 's' : ''}`}
        >
          <Star
            className={`
              ${starSize}
              transition-all duration-200
              ${value <= displayRating 
                ? 'fill-amber-warm text-amber-warm' 
                : 'fill-none text-wood-light'
              }
              ${!readonly && hoveredRating >= value ? 'drop-shadow-lg' : ''}
            `}
          />
        </button>
      ))}
      
      {/* Rating text */}
      {rating && (
        <span className="ml-2 text-sm font-medium text-wood-dark">
          {rating}/5
        </span>
      )}
    </div>
  );
}
