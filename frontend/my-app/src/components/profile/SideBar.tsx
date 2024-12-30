import React from "react";
import { useRouter } from "next/router";
import {
  UserCircle,
  LogOut,
  Newspaper,
  Lock,
  Headphones,
  File,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/authSlice";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export const ProfileSidebar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    router.replace("/signin");
  };

  const sidebarItems: SidebarItem[] = [
    {
      label: "User Info",
      icon: <UserCircle className="w-5 h-5" />,
      href: "/profile",
    },
    {
      label: "My Blogs",
      icon: <Newspaper className="w-5 h-5" />,
      href: "/profile/my-blogs",
    },
    {
      label: "Listener Application",
      icon: <Headphones className="w-5 h-5" />,
      href: "/profile/listener-application",
    },
    {
      label: "Reset Password",
      icon: <Lock className="w-5 h-5" />,
      href: "/profile/reset-password",
    },
    {
      label: "Download My Data",
      icon: <File className="w-5 h-5" />,
      href: "/profile/download",
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <div className="flex flex-col space-y-4 justify-between">
        {sidebarItems.map((item) => (
          <div
            key={item.label}
            onClick={() => router.push(item.href)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer
        ${
          router.asPath === item.href
            ? "bg-gray-100 text-blue-600"
            : "hover:bg-gray-50"
        }`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center mb-10 space-x-3 p-3 rounded-lg w-full text-red-600 hover:bg-red-50 sticky"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
