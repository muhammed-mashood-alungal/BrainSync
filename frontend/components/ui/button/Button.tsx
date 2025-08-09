import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
  }

const Button : React.FC<ButtonProps> = ({ children, className ="", ...props }) => {
    return (
      <button
        className={`bg-cyan-400 hover:bg-cyan-500 px-4 py-3 text-black  rounded-md font-medium transition-all  hover:cursor-pointer duration-200 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
export default Button;
  