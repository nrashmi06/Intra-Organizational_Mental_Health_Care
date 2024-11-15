// components/ui/table.tsx

import React from 'react';

export const Table = ({ children }: { children: React.ReactNode }) => {
  return (
    <table className="min-w-full table-auto border-collapse">{children}</table>
  );
};

export const TableHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <thead className="bg-gray-100 text-left">{children}</thead>
  );
};

export const TableBody = ({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>;
};

export const TableRow = ({ children }: { children: React.ReactNode }) => {
  return <tr className="border-b">{children}</tr>;
};

export const TableHead = ({ children }: { children: React.ReactNode }) => {
  return <th className="px-4 py-2">{children}</th>;
};

export const TableCell = ({ children }: { children: React.ReactNode }) => {
  return <td className="px-4 py-2">{children}</td>;
};
