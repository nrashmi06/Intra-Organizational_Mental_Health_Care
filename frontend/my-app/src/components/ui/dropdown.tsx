import * as React from "react";

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block text-left">{children}</div>
);

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean } // Extend with `asChild`
>(({ children, asChild, className = "", ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";


export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: string } // Extend with `align`
>(({ children, align = "start", className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`absolute mt-2 w-48 origin-top-${align} rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${className}`}
    {...props}
  >
    {children}
  </div>
));
DropdownMenuContent.displayName = "DropdownMenuContent";


export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </div>
));
DropdownMenuItem.displayName = "DropdownMenuItem";
