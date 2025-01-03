// components/ui/Badge.tsx
import React, { HTMLProps } from 'react';

interface BadgeProps extends HTMLProps<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'link' | 'secondary'; // Customize the types of button variants
  color?: 'green' | 'red' | 'yellow' | 'gray' | 'teal' | ''; 
}

const Badge: React.FC<BadgeProps> = ({ children, className = '', color = 'gray', ...props }) => {
  // Determine the background color based on the 'color' prop
  const colorClasses: { [key: string]: string } = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',  // Default color for pending or unknown status
    teal: 'bg-teal-600',
    '': '',  // Handle empty string case
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full text-white ${colorClasses[color]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
