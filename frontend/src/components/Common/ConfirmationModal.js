import React from 'react';
import './Common.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const typeClass = {
    warning: 'warning',
    danger: 'danger',
    info: 'info',
    success: 'success'
  }[type];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className={`modal-header ${typeClass}`}>
          <h3>{title}</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`btn-confirm ${typeClass}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
