//Navbar for the dashboard
"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Avatar from "../ui/avatar";

type NavbarProps = {
  children?: React.ReactNode;
};

export default function Navbar({ children }: NavbarProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="flex h-16 items-center px-4 md:px-6">
        {children}
        <div className="flex items-center gap-x-4">
          <h2 className="text-xl hidden md:block">Dashboard</h2>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button href="/signin" className="text-red-400 flex gap-3" variant="link">
            Log out <LogOut className="h-5 w-5" /> 
          </Button>
          <div className="flex items-center gap-x-2">
            <span className="text-sm hidden md:inline-block">Admin</span>
            <Button variant="link" href="/adminprofile"><Avatar className="h-8 w-8" name="Admin" /></Button>
          </div>
        </div>
      </div>
    </header>
  );
}
