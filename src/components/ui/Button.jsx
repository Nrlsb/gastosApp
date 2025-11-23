import React, { memo } from 'react';

const Button = memo(({ children, variant = 'primary', size, className = '', ...props }) => {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size ? `btn-${size}` : '';

  const allClasses = `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button className={allClasses} {...props}>
      {children}
    </button>
  );
});

export default Button;
