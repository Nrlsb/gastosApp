import React, { memo } from 'react';

const Button = memo(({ children, variant = 'primary', size, className = '', ...props }) => {
  const baseClasses = 'btn transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClass = `btn-${variant}`;
  const sizeClass = size ? `btn-${size}` : '';

  // Inline styles for transition if not using utility classes for it, 
  // but since we are using standard CSS variables, let's ensure the class names map to our CSS or add inline styles for specific improvements if needed.
  // However, looking at index.css, .btn-primary etc are defined there. 
  // Let's add a style prop to enforce the transition from variables.css
  
  const style = {
    transition: 'var(--transition-base)',
    borderRadius: 'var(--border-radius-md)',
    padding: size === 'lg' ? 'var(--spacing-md) var(--spacing-xl)' : 'var(--spacing-sm) var(--spacing-md)',
    ...props.style
  };

  const allClasses = `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button className={allClasses} style={style} {...props}>
      {children}
    </button>
  );
});

export default Button;
