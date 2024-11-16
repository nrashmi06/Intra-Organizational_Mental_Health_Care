// import Link from "next/link"
// <div className="flex items-center justify-between">
//   <div className="flex items-center space-x-2">
//     <Checkbox id="remember" />
//     <label
//       htmlFor="remember"
//       className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//     >
//       Remember me
//     </label>
//   </div>
//   <Link
//     href="/forgot-password"
//     className="text-sm font-medium text-primary hover:underline"
//   >
//     Forgot Password?
//   </Link>
// </div>
import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox: React.FC<CheckboxProps> = ({ id, className, ...props }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        className={`form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring focus:ring-primary focus:ring-opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
};
