// components/ui/Badge.tsx
import React, { HTMLProps } from 'react';

interface BadgeProps extends HTMLProps<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  color?: 'green' | 'red' | 'yellow' | 'gray';  // Define colors for approved, rejected, pending, etc.
}

const Badge: React.FC<BadgeProps> = ({ children, className = '', color = 'gray', ...props }) => {
  // Determine the background color based on the 'color' prop
  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',  // Default color for pending or unknown status
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
