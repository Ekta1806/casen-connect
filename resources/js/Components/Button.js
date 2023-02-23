import React from 'react';

export default function Button({ type = 'submit', className = '', processing, children }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center px-4 py-2 text-sm text-white bg-blue-600 font-semibold rounded-full border hover:text-white hover:bg-yellow-500  focus:outline-none ease-linear transition-all ${
        processing && 'opacity-25'
      } ${className}`}
      disabled={processing}
    >
      {children}
    </button>
  );
}
