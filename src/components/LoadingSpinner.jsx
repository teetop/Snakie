import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      {text && <p className="text-gray-400">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;