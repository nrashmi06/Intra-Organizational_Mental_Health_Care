import React, { useState } from "react";
import { ProfileSidebar } from "@/components/profile/SideBar";
import Navbar from "@/components/profile/Navbar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className={`
        fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden
        ${sidebarOpen ? 'block' : 'hidden'}
      `} onClick={() => setSidebarOpen(false)} />
      
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <ProfileSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm z-30">
          <div className="px-4 py-3 flex items-center justify-between w-full">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="ghost"
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Navbar />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;