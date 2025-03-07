import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
  }

const Button : React.FC<ButtonProps> = ({ children, className ="", ...props }) => {
    return (
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-all  hover:cursor-pointer duration-200 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  