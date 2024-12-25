"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Avatar from "../ui/avatar";
import { clearUser } from "@/store/authSlice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/service/user/Logout";
import { RootState } from "@/store";

type NavbarProps = {
  children?: React.ReactNode;
};

export default function Navbar({ children }: NavbarProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handleLogout = async () => {
    try {
      await router.push("/signin");
      await logout(token);
      dispatch(clearUser());
      
      // Only clear the user state after navigation is complete
      
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="flex h-16 items-center px-4 md:px-6">
        {children}
        <div className="flex items-center gap-x-4">
          <h2 className="text-xl hidden md:block">Dashboard</h2>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button
            onClick={handleLogout}
            className="text-red-400 flex gap-3"
            variant="link"
          >
            Log out <LogOut className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-x-2">
            <span className="text-sm hidden md:inline-block">Admin</span>
            <Button variant="link" href="/adminprofile">
              <Avatar className="h-8 w-8" name="Admin" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}