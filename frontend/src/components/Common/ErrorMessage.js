import React from 'react';
import './Common.css';

const ErrorMessage = ({ message, onRetry, onClose }) => {
  return (
    <div className="error-message">
      <div className="error-content">
        <span className="error-icon">!</span>
        <span className="error-text">{message}</span>
        {onRetry && (
          <button onClick={onRetry} className="retry-btn">
            Retry
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
