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
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Navbar */}
        <Navbar>
          <Button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(true)}
            variant="link"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </Navbar>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
