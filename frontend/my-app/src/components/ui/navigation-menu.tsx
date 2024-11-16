// src/components/ui/navigation-menu.tsx
import { FC } from "react";

// Component for wrapping the entire navigation menu
export const NavigationMenu: FC<{ children: React.ReactNode }> = ({ children }) => (
  <nav className="navigation-menu">{children}</nav>
);

// Component for the content of the navigation menu (e.g., links, submenus)
export const NavigationMenuContent: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="navigation-menu-content">{children}</div>
);

// Component for visual indication of the current selection in the navigation
export const NavigationMenuIndicator: FC = () => (
  <div className="navigation-menu-indicator">Current Selection</div>
);

// Individual navigation items (e.g., list items or links)
export const NavigationMenuItem: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="navigation-menu-item">{children}</div>
);

// Link used inside the navigation item (e.g., to navigate to different pages)
export const NavigationMenuLink: FC<{ children: React.ReactNode }> = ({ children }) => (
  <a href="#" className="navigation-menu-link">
    {children}
  </a>
);

// List component for the menu, likely used to group `NavigationMenuItem` components
export const NavigationMenuList: FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="navigation-menu-list">{children}</ul>
);

// Trigger component (e.g., button or clickable element to open/close a menu)
export const NavigationMenuTrigger: FC<{ children: React.ReactNode }> = ({ children }) => (
  <button className="navigation-menu-trigger">{children}</button>
);

// Viewport component, typically used to control the space for the menu's content
export const NavigationMenuViewport: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="navigation-menu-viewport">{children}</div>
);
