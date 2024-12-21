import React from 'react';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: number; 
  gap?: string;  
}

const Grid: React.FC<GridProps> = ({ children, className = '', cols = 2, gap = 'gap-4' }) => {
  return (
    <div
      className={`grid ${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

export default Grid;
