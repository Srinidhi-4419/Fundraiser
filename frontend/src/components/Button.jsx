import React from 'react'

const Button = ({ 
    children, 
    onClick, 
    type = 'button', 
    className = '', 
    variant = 'primary' 
  }) => {
    const baseStyles = "px-4 py-2 rounded-md transition-colors focus:outline-none";
    
    const variantStyles = {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      outline: "border border-blue-500 text-blue-500 hover:bg-blue-50",
      destructive: "bg-red-500 text-white hover:bg-red-600"
    };
  
    return (
      <button
        type={type}
        onClick={onClick}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;