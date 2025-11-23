import React, { memo } from 'react';

const Input = ({ label, id, type = 'text', className = '', ...props }) => {
  const inputClasses = `form-control ${className}`.trim();
  const labelClasses = `form-label`;

  return (
    <div className="mb-3">
      {label && <label htmlFor={id} className={labelClasses}>{label}</label>}
      <input
        type={type}
        id={id}
        className={inputClasses}
        {...props}
      />
    </div>
  );
};

export default memo(Input);
