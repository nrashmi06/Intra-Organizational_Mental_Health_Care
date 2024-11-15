// src/components/ui/label.tsx
import React from 'react'

export const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
      {children}
    </label>
  )
}
