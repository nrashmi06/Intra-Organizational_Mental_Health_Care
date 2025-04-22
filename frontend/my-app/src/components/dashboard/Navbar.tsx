"use client";

import { Button } from "@/components/ui/button";
import { Avatar } from "../ui/avatar";
import { useRouter } from "next/router";
import { logout } from "@/service/user/Logout";
import { RootState } from "@/store";
import useClearStore from "@/utils/clearStore";
import { useSelector } from "react-redux";

type NavbarProps = {
  children?: React.ReactNode;
};

export default function Navbar({ children }: NavbarProps) {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const clearStore = useClearStore();

  const handleLogout = async () => {
    try {
      await router.push("/signin");
      await logout(token);
      clearStore();
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        {children}

        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium text-gray-800 hidden md:block">
            Dashboard
          </h2>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-900"
            variant="ghost"
            size="sm"
          >
            Home
          </Button>
          <Button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            variant="ghost"
            size="sm"
          >
            Log out
          </Button>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/adminprofile")}>
              <Avatar className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}