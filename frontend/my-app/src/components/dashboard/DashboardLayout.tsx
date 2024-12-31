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
    if (role !== "ADMIN") {
      router.push("/unauthorized");
    } else {
      setIsAuthorized(true);
    }
  }, [role, router]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col md:pl-64">
        <Navbar>
          <Button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
            variant="ghost"
            size="icon"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </Navbar>
        
        <main className="flex-1 p-6 mx-auto w-full max-w-7xl min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}