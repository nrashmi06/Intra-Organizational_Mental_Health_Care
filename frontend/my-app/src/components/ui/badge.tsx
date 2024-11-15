// components/ui/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any; // to support any other props (like style, onClick, etc.)
}

const Badge: React.FC<BadgeProps> = ({ children, className = '', ...props }) => {
  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full bg-purple-600 text-white ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
