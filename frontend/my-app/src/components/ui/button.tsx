// button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;   // Content inside the button (e.g., text, icons)
  onClick?: () => void;        // Optional onClick handler
  className?: string;          // Optional additional CSS class
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className={`btn ${className}`}>
      {children}
    </button>
  );
};
