import React from 'react';

const Textarea = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  rows = 4,
  ...rest 
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...rest}
    />
  );
};

export default Textarea;