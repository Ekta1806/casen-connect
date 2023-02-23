import React, { useEffect, useRef } from 'react';

export default function Input({
  type = 'text',
  name,
  value,
  className,
  autoComplete,
  required,
  isFocused,
  handleChange,
  placeholder,
  id,
}) {
  const input = useRef();

  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col items-start">
      <input
        type={type}
        name={name}
        value={value}
        id={id}
        placeholder={placeholder}
        className={`py-2 px-2 bg-white placeholder:text-gray-300 border border-gray-300 focus:border-blue-600 focus:border-1 rounded-md focus:outline-none focus:shadow-none focus:ring-0 ${className}`}
        ref={input}
        autoComplete={autoComplete}
        required={required}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
}
