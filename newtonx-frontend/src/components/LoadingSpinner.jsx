import React from 'react';

function LoadingSpinner({ size = 'medium' }) {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-white ${sizeClasses[size]}`}
    />
  );
}

export default LoadingSpinner;