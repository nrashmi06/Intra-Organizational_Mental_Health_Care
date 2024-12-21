import React from 'react'

export const Textarea = ({
  id,
  label,
  name,
  placeholder,
  value,
  onChange,
  className
}: {
  id ?: string
  label?: string,
  name?: string,
  placeholder?: string
  value?: string
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  className?: string
}) => {
  return (
    <div>
    <label className="block text-purple-700 font-semibold mb-2">{label}</label>
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`p-2 border border-gray-300 rounded-md w-full ${className}`}
    />
    </div>
  )
}
