// components/ui/card.tsx
import React from 'react';
import clsx from 'clsx';

// Define a reusable interface for all Card components
interface CardProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;  // Optional className prop for styling
  children: React.ReactNode;  // Content inside the card
}

// Card component with default styling and additional class support
const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('bg-white shadow-lg rounded-lg overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
};

// CardContent component for content inside the card with padding
const CardContent: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('p-4', className)} {...props}>
      {children}
    </div>
  );
};

// CardFooter component for additional content at the bottom of the card
const CardFooter: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('p-4 border-t', className)} {...props}>
      {children}
    </div>
  );
};

export { Card, CardContent, CardFooter };
