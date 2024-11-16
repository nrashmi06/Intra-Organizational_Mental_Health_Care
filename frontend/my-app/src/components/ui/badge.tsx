// components/ui/Badge.tsx
import React, { HTMLProps } from 'react';

interface BadgeProps extends HTMLProps<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className = '', ...props }) => {
  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full bg-black text-white ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
