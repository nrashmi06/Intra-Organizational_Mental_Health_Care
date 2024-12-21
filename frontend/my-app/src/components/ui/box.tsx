import React from 'react';
import clsx from 'clsx';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements; 
}

const Box: React.FC<BoxProps> = ({ children, className = '', as: Component = 'div' }) => {
  return <Component className={clsx('p-4', className)}>{children}</Component>;
};

export default Box;
