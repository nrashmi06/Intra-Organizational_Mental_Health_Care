"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Home } from "lucide-react";

type UserNavbarProps = {
  children?: React.ReactNode;
};

export default function UserNavbar({ children }: UserNavbarProps) {
  const router = useRouter();

  return (
    <header className="font-bold sticky top-0 z-10 w-full">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="hidden md:block">
          <span className="text-xl">My Account</span>
        </div>
        {children}
        <div className="ml-auto flex items-center gap-2">
          <Button
            onClick={() => router.push("/")}
            className="text-black-400 flex flex-row gap-3"
            variant="link"
          >
            Home
            <Home className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}