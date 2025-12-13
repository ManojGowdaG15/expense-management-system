import React from 'react';
import './Common.css';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  return (
    <div className="loading-spinner-container">
      <div className={`spinner ${sizeClass}`}></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;