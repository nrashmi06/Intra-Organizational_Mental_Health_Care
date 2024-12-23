// components/ui/StackNavbar.tsx
import React from 'react';
import Link from 'next/link';

interface StackNavbarItem {
  label: string;
  href?: string;
}

interface StackNavbarProps {
  items: StackNavbarItem[];
}

const StackNavbar: React.FC<StackNavbarProps> = ({ items }) => {
  return (
    <div className="bg-gray-100 border-b border-gray-200 py-3 px-4">
      <nav className="flex items-center space-x-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="text-blue-500 hover:text-blue-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="text-gray-400 mx-2">/</span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default StackNavbar;