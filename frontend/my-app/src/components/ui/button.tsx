
// components/ui/button.tsx
import React from 'react';
import clsx from "clsx";
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'link'; // Customize the types of button variants
  size?: 'sm' | 'md' | 'lg';
  href?: string; // Optional href prop to make the button a link
  children: React.ReactNode; // Content inside the button (e.g., text, icons)
  onClick?: () => void; // Optional onClick handler
  className?: string; // Optional additional CSS class
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className,
  href,
  children,
  onClick,
  ...props
}) => {
  const button = (
    <button
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-lg focus:outline-none transition-all duration-200',
        {
          'bg-blue-500 text-white hover:bg-black-600': variant === 'default',
          'border border-blavk-500 text-blue-500 hover:bg-black-100': variant === 'outline',
          'text-blue-500 hover:underline': variant === 'link',
          'text-sm': size === 'sm',
          'text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );

  // If the `href` prop is provided, wrap the button in a Next.js `Link`
  if (href) {
    return (
      <Link href={href} passHref>
        {button}
      </Link>
    );
  }

  return button;
};

export { Button };
