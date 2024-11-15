// card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode; // Content of the card
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="card">{children}</div>;
};

export const CardContent: React.FC<CardProps> = ({ children }) => {
  return <div className="card-content">{children}</div>;
};

export const CardFooter: React.FC<CardProps> = ({ children }) => {
  return <div className="card-footer">{children}</div>;
};
