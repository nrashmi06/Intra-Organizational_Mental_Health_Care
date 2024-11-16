// src/components/ui/textarea.tsx
import React from 'react'

export const Textarea = ({
  id,
  placeholder,
  value,
  onChange,
  className
}: {
  id: string
  placeholder?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  className?: string
}) => {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`p-2 border border-gray-300 rounded-md w-full ${className}`}
    />
  )
}
