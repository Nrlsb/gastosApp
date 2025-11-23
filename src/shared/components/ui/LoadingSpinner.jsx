import React, { memo } from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = memo(({ size = 'md', variant = 'primary', text = 'Cargando...' }) => {
  const spinnerClass = `spinner-border text-${variant}`;
  const spinnerStyle = {
    width: size === 'sm' ? '1.5rem' : size === 'lg' ? '3rem' : '2rem',
    height: size === 'sm' ? '1.5rem' : size === 'lg' ? '3rem' : '2rem',
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className={spinnerClass} style={spinnerStyle} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <span className="ms-2">{text}</span>}
    </div>
  );
});

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  text: PropTypes.string,
};

export default LoadingSpinner;
