import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "action" | "text-like";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  
  let classeNames = "";
  switch (variant) {
    case "primary":
      classeNames = `bg-cyan-400 hover:bg-cyan-500 px-4 py-3 text-black  
      rounded-md font-medium transition-all  hover:cursor-pointer 
      duration-200 ${className}`;
      break;
    case "secondary":
      classeNames = `bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-center
      transition-all hover:cursor-pointer 
      duration-200 ${className}`;
      break;
    case "action":
      classeNames = `bg-cyan-400 hover:bg-cyan-500 px-4 py-3 text-black  
      rounded-md font-medium transition-all  hover:cursor-pointer 
      duration-200 ${className}`;
      break;
    case 'text-like':
      classeNames = `text-cyan-400 hover:text-cyan-300 ${className}`;
      break;
  }


  return (
    <button {...props} className={classeNames}>
      {" "}
      {children}
    </button>
  );
};

export default Button;
