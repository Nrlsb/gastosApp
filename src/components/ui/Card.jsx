import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  const allClasses = `card p-4 shadow-lg ${className}`.trim(); // Using p-4 and shadow-lg as default based on CrearPlanilla.jsx

  return (
    <div className={allClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
