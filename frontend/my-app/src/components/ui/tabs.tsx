'use client'
import React from "react"
import { useState, ReactNode } from "react"
import clsx from "clsx"

interface TabsProps {
  defaultValue?: string
  className?: string
  children: ReactNode
}

interface TabsContextProps {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = React.createContext<TabsContextProps | undefined>(undefined)

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || "")

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={clsx("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => (
  <div className={clsx("flex border-b border-gray-200", className)}>{children}</div>
)

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className }) => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component")
  }

  const { activeTab, setActiveTab } = context

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={clsx(
        "py-2 px-4 text-sm font-medium focus:outline-none transition",
        activeTab === value
          ? "text-purple-700 border-b-2 border-purple-700"
          : "text-gray-500 hover:text-purple-700",
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component")
  }

  const { activeTab } = context

  return activeTab === value ? (
    <div className={clsx("mt-4 p-4 bg-white rounded-lg shadow", className)}>{children}</div>
  ) : null
}
