import React from "react";

interface SelectProps {
  children: React.ReactNode;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string; // Added className for styling
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  onClick: () => void;
}

const Select: React.FC<SelectProps> = ({ children, placeholder, onChange, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(undefined);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <SelectTrigger onClick={() => setIsOpen(!isOpen)}>
        {selectedValue || placeholder || "Select an option"}
      </SelectTrigger>
      {isOpen && (
        <SelectContent>
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<SelectItemProps>, { onSelect: handleSelect })
              : null
          )}
        </SelectContent>
      )}
    </div>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({ value, children, onSelect }) => {
  return (
    <button
      type="button"
      className="block w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
      onClick={() => onSelect?.(value)}
    >
      {children}
    </button>
  );
};

const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, onClick }) => (
  <button
    type="button"
    className="w-full px-4 py-2 text-left bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
    onClick={onClick}
  >
    {children}
  </button>
);

const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg pb-4">
    {children}
  </div>
);

const SelectValue: React.FC<{ value: string }> = ({ value }) => (
  <span className="block truncate">{value}</span>
);

export { Select, SelectItem, SelectTrigger, SelectContent, SelectValue };
