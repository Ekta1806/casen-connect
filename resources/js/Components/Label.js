import React from 'react';

export default function Label({ forInput, value, className, children, required }) {
  return (
    <label htmlFor={forInput} className={`block text-base font-semibold text-gray-500 ${className}`}>
      {value || { children }}
      {required === true && <span className="text-red-600 ml-1">*</span>}
    </label>
  );
}
