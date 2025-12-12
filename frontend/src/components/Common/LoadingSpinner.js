import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[size];

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`loading-spinner ${sizeClass}`}></div>
    </div>
  );
};

export default LoadingSpinner;