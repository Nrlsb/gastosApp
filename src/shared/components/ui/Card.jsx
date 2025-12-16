import React, { memo } from 'react';

const Card = memo(({ children, className = '', ...props }) => {
  const style = {
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--shadow-md)',
    transition: 'var(--transition-base)',
    ...props.style
  };

  const allClasses = `card p-4 ${className}`.trim();

  return (
    <div className={allClasses} style={style} {...props}>
      {children}
    </div>
  );
});

export default Card;
