import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="alert alert-error">
      <div className="flex items-center gap-2">
        <FiAlertCircle className="text-xl" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary mt-2">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;