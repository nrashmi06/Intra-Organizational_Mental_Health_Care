"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { clearUser } from "@/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/service/user/Logout";
import { RootState } from "@/store";
import { clearEventSources } from "@/store/eventsourceSlice";
import { clearNotifications } from "@/store/notificationSlice";
import useClearStore from "@/utils/clearStore";
import { clearHelplines } from "@/store/emergencySlice";
import { Home } from "lucide-react";

type UserNavbarProps = {
  children?: React.ReactNode;
};

export default function UserNavbar({ children }: UserNavbarProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const clearStore = useClearStore();

  const handleLogout = async () => {
    try {
      console.log("Logging out... with token : ", token);
      await router.push("/signin");
      await logout(token);
      dispatch(clearEventSources());
      dispatch(clearNotifications());
      dispatch(clearUser());
      dispatch(clearHelplines());
      clearStore();
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  return (
    <header className="border-b  transition-colors duration-300 text-white font-bold sticky top-0 z-10 w-full">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Left Section */}
        {children}
        <div className="flex items-center gap-x-4">
          <h2 className="text-xl font-semibold hidden md:block">My Account</h2>
        </div>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-2">
          {/* Home Button */}
          <Button
            onClick={() => router.push("/")}
            className="text-black-400"
            variant="link"
          >
          <Home className="h-6 w-6" />
          </Button>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            className="text-red-400"
            variant="link"
          >
            Log out
          </Button>

          {/* Avatar */}
        </div>
      </div>
    </header>
  );
}
