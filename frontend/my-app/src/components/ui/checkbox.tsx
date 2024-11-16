import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, ...props }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        {...props}
      />
      {label && (
        <label htmlFor={id} className="text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
