// Star rating component
'use client';

import React, { useState } from 'react';

interface StarRatingProps {
  maxStars: number;
  label: string;
  required?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  maxStars, 
  label, 
  required = false,
  onChange 
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const handleRatingChange = (value: number) => {
    setRating(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <button
              type="button"
              key={starValue}
              className={`text-2xl focus:outline-none ${
                (hover || rating) && starValue <= (hover || rating || 0)
                  ? 'text-black'
                  : 'text-gray-300'
              }`}
              onClick={() => handleRatingChange(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
              aria-label={`Rate ${starValue} out of ${maxStars}`}
            >
              ★
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;