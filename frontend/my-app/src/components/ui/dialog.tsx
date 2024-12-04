import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
};

export const DialogTrigger: React.FC<
  React.ComponentProps<typeof DialogPrimitive.Trigger>
> = (props) => {
  return <DialogPrimitive.Trigger {...props} />;
};

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
}) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={`fixed z-50 w-[95%] max-w-md rounded-lg bg-white p-6 shadow-xl 
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary 
          ${className}`}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full">
          <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
};

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const DialogTitle: React.FC<
  React.ComponentProps<typeof DialogPrimitive.Title>
> = ({ children, className, ...props }) => {
  return (
    <DialogPrimitive.Title
      className={`text-lg font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
};

export const DialogDescription: React.FC<
  React.ComponentProps<typeof DialogPrimitive.Description>
> = ({ children, className, ...props }) => {
  return (
    <DialogPrimitive.Description
      className={`text-sm text-gray-600 mt-2 ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
};

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={`flex justify-end space-x-2 mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
