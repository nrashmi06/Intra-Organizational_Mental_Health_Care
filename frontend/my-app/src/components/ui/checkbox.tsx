// src/components/ui/checkbox.tsx

import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, className, label, ...props }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        className={`form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring focus:ring-primary focus:ring-opacity-50 ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;  // Ensure the component is exported as default
