import React, { memo } from 'react';

const Typography = memo(({ variant = 'p', children, className = '', ...props }) => {
  const Tag = variant;
  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
});

export default Typography;
