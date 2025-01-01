import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  UserCircle,
  LogOut,
  Newspaper,
  Lock,
  Headphones,
  File,
  X,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import useClearStore from "@/utils/clearStore";
import { logout } from "@/service/user/Logout";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

type ProfileSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const ProfileSidebar = ({ open, onClose }: ProfileSidebarProps) => {
  const router = useRouter();
  const clearStore = useClearStore();
  const previousPath = useRef(router.asPath);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  useEffect(() => {
    if (previousPath.current !== router.asPath) {
      previousPath.current = router.asPath;
      onClose();
    }
  }, [router.asPath, onClose]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    setIsLoggingOut(true);
    try {
      const response = await logout(accessToken);
      if (!response) {
        console.error("No response from logout API");
        return;
      }
      if (response.status === 200 || response.status === 204) {
        console.log(response);
        console.log("RESPONSESTATUS", response.status);
        clearStore();
        router.push("/signin");
      } else {
        console.error("Unexpected response from logout API:", response);
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sidebarItems = [
    {
      label: "User Profile",
      icon: UserCircle,
      href: "/profile",
    },
    {
      label: "My Blogs",
      icon: Newspaper,
      href: "/profile/my-blogs",
    },
    {
      label: "Listener Application",
      icon: Headphones,
      href: "/profile/listener-application",
    },
    {
      label: "Change Password",
      icon: Lock,
      href: "/profile/change-password",
    },
    {
      label: "Personal Data",
      icon: File,
      href: "/profile/download",
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-6 border-b border-emerald-600/20">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo/logo.png"
            alt="SerenitySphere Logo"
            width={44}
            height={44}
            className="rounded-full ring-2 ring-emerald-100/20"
          />
          <span className="text-lg font-semibold text-emerald-50">
            SerenitySphere
          </span>
        </div>
        {/* Mobile Close Button */}
        <button
          className="block md:hidden text-emerald-100 p-2 rounded-full hover:bg-emerald-700/50 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className={cn(
              "group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out",
              router.asPath === item.href
                ? "bg-emerald-700/60 text-emerald-50 shadow-sm"
                : "text-emerald-100 hover:bg-emerald-700/40 hover:text-emerald-50"
            )}
          >
            <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-emerald-600/20">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            "flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-rose-100 hover:bg-rose-500/20 transition-colors duration-200",
            isLoggingOut && "opacity-50 cursor-not-allowed"
          )}
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5" />
          {isLoggingOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-emerald-800 to-emerald-900 shadow-xl">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-emerald-800 to-emerald-900 transform transition-transform duration-300 ease-in-out shadow-2xl",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
    </>
  );
};
