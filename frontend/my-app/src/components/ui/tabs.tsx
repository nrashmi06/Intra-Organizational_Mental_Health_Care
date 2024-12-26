'use client';
import React, { useState, ReactNode } from "react";
import clsx from "clsx";

// Context Types
interface TabsContextProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextProps | undefined>(undefined);

// Tabs Component Props
interface TabsProps {
  defaultValue?: string;
  className?: string;
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || "");

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={clsx("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

// TabsList Component Props
interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => (
  <div className={clsx("flex border-b border-gray-200", className)}>{children}</div>
);

// TabsTrigger Component Props
interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const { activeTab, setActiveTab } = context;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={clsx(
        "py-2 px-4 text-sm font-medium focus:outline-none transition",
        activeTab === value
          ? "text-teal-800 border-b-2 border-teal-500"
          : "text-gray-500 hover:text-teal-600",
        className
      )}
    >
      {children}
    </button>
  );
};

// TabsContent Component Props
interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  const { activeTab } = context;

  return activeTab === value ? (
    <div className={clsx("mt-4 p-4 bg-white rounded-lg shadow", className)}>{children}</div>
  ) : null;
};
