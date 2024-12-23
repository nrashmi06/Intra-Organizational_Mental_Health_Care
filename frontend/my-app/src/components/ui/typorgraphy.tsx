import React from 'react';
import clsx from 'clsx';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption';
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  className = '',
}) => {
  const baseStyles = 'text-gray-800';
  const variantStyles: { [key: string]: string } = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-medium',
    h4: 'text-xl font-medium',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium',
    body: 'text-base',
    caption: 'text-sm text-gray-500',
  };

  const Component = variant.startsWith('h') ? variant : 'p';

  return (
    <Component className={clsx(baseStyles, variantStyles[variant], className)}>
      {children}
    </Component>
  );
};

export default Typography;
