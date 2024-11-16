import React, { useState } from 'react';

type TabsProps = {
  children: React.ReactNode;
};

type TabsListProps = {
  children: React.ReactNode;
};

type TabsTriggerProps = {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
};

type TabsContentProps = {
  value: string;
  children: React.ReactNode;
};

export function Tabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTriggerClick = (value: string) => {
    setActiveTab(value);
  };

  const renderChildren = React.Children.map(children, (child) => {
    if (React.isValidElement<TabsTriggerProps & { activeTab: string | null; handleTriggerClick: (value: string) => void }>(child)) {
      return React.cloneElement(child, { activeTab, handleTriggerClick });
    }
    return child;
  });

  return <div>{renderChildren}</div>;
}

export function TabsList({ children }: TabsListProps) {
  return <div className="flex gap-2 border-b">{children}</div>;
}

export function TabsTrigger({
  value,
  children,
  onClick,
  activeTab,
  handleTriggerClick,
}: TabsTriggerProps & { activeTab: string | null; handleTriggerClick: (value: string) => void }) {
  return (
    <button
      onClick={() => {
        handleTriggerClick(value);
        if (onClick) onClick();
      }}
      className={`p-2 ${
        activeTab === value ? 'border-b-2 border-blue-500 text-blue-500' : ''
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  activeTab,
}: TabsContentProps & { activeTab: string | null }) {
  if (activeTab !== value) return null;
  return <div className="p-4">{children}</div>;
}
