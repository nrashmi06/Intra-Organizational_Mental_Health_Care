import React from 'react';

export const Label = ({
  htmlFor,
  children,
  className = '', // Default to an empty string if no className is passed
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-gray-700 ${className}`} // Use the passed className here
    >
      {children}
    </label>
  );
};
