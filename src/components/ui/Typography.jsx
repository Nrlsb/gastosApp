import React from 'react';

const Typography = ({ variant = 'p', children, className = '', ...props }) => {
  const Tag = variant;
  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
};

export default Typography;
