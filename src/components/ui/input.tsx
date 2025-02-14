import React from 'react';

export const Input: React.FC<{ label: string; placeholder: string; name: string; optional?: boolean;}> = ({ label, placeholder, name, optional,  }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black-700 mb-1">
        {label} {optional && <span className="text-gray-500 dark:text-gray-400">(Optional)</span>}
      </label>
      <input
        type="text"
        name={name} 
        placeholder={placeholder}
        className="w-full border border-gray-300  rounded-md p-3 bg-white text-left text-gray-800 focus:outline-none dark:bg-[#1a1a1a] dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};
