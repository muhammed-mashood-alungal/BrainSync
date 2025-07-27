import React, { ChangeEventHandler, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type: string;
  name: string;
  placeholder: string;
  className?: string;
}

function Input({
  value,
  onChange,
  type,
  name,
  placeholder,
  className,
  ...rest
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} w-full px-4 py-3 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:border-cyan-400`}
      {...rest}
    />
  );
}

export default Input;
