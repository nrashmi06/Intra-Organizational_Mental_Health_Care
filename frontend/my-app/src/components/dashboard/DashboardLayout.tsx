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

        <main
          className="flex-1 p-6 mx-auto w-full max-w-7xl min-h-[calc(100vh-4rem)]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a7f3d0' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
