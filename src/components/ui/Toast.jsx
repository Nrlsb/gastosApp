import React, { memo } from 'react';
import PropTypes from 'prop-types';

const Toast = memo(({ message, type, onClose }) => {
  if (!message) return null;

  const alertClass = `alert alert-${type} alert-dismissible fade show`;

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
      <div className={alertClass} role="alert">
        {message}
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      </div>
    </div>
  );
});

Toast.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  onClose: PropTypes.func.isRequired,
};

Toast.defaultProps = {
  type: 'info',
};

export default Toast;
