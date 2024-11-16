import * as React from 'react'

export const Avatar: React.FC<{ className?: string; imageUrl?: string; name?: string }> = ({
  className,
  imageUrl,
  name
}) => {
  return (
    <div className={`${className} relative`}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-full w-full object-cover rounded-full" />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-white bg-gray-600 rounded-full">
          {name ? name[0] : '?'}
        </div>
      )}
    </div>
  )
}
