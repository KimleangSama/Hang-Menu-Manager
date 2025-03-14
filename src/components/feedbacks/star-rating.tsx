import React from 'react';

// Enum for star ratings
const StarRating = {
    NONE: 'NONE',
    ONE: 'ONE',
    TWO: 'TWO',
    THREE: 'THREE',
    FOUR: 'FOUR',
    FIVE: 'FIVE'
};

// Map enum values to number of stars
const starMap = {
    [StarRating.NONE]: 0,
    [StarRating.ONE]: 1,
    [StarRating.TWO]: 2,
    [StarRating.THREE]: 3,
    [StarRating.FOUR]: 4,
    [StarRating.FIVE]: 5
};

const StarRatingDisplay = ({ rating = StarRating.NONE }) => {
    // Convert rating to number of stars
    const starCount = starMap[rating] || 0;

    return (
        <div className="flex flex-col items-center">
            <div className="flex">
                {[...Array(5)].map((_, index) => (
                    <span
                        key={index}
                        className={`text-2xl ${index < starCount ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                        ★
                    </span>
                ))}
            </div>
            <div className="mt-2 text-sm text-gray-600">
                {rating === null ? 'No rating' : (
                    <>
                        {rating}: {starCount} star{starCount !== 1 ? 's' : ''}
                    </>
                )}
            </div>
        </div>
    );
};

export default StarRatingDisplay;