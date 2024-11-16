// src/components/ui/input.tsx
import React from 'react'

export const Input = ({
  id,
  type = 'text',
  placeholder,
  value,
  onChange
}: {
  id: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 rounded-md w-full"
    />
  )
}
