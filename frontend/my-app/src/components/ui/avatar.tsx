import * as React from 'react'
import Image from 'next/image'

// Define the interface for the component props
interface AvatarProps {
  className?: string
  imageUrl?: string
  name?: string
}

// Create the Avatar component without using React.FC
const Avatar = ({ className, imageUrl, name }: AvatarProps): JSX.Element => {
  return (
    <div className={`${className} relative`}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name || 'Avatar'}
          layout="fill"
          className="object-cover rounded-full"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-white bg-gray-600 rounded-full">
          {name ? name[0] : '?'}
        </div>
      )}
    </div>
  )
}

export default Avatar
