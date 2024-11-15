// components/ui/card.tsx
import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('bg-white shadow-lg rounded-lg overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
};

const CardContent: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('p-4', className)} {...props}>
      {children}
    </div>
  );
};

export { Card, CardContent };
