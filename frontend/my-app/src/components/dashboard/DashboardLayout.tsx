"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/SideBar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const role = useSelector((state: RootState) => state.auth.role);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check authorization when component mounts or role changes
    if (role !== "ADMIN") {
      router.push("/unauthorized");
    } else {
      setIsAuthorized(true);
    }
  }, [role, router]);

  // Don't render anything while checking authorization
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar - width matches the ml-72 offset in navbar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content wrapper */}
      <div className="flex flex-col md:pl-72"> {/* Changed from ml-64 to pl-72 to match sidebar width */}
        {/* Navbar */}
        <Navbar>
          <Button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
            variant="ghost"
            size="icon"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </Navbar>

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6 min-h-[calc(100vh-4rem)]"> {/* Added padding and min-height */}
          {children}
        </main>
      </div>
    </div>
  );
}