"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function UserNavbar() {
  const router = useRouter();

  return (
    <header className="border-b bg-white sticky top-0 z-10 w-full">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Left Section */}
        <h2 className="text-xl font-semibold">My Account</h2>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-4">
          {/* Home Button */}
          <Button
            onClick={() => router.push("/")}
            className="flex items-center text-gray-600"
            variant="link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a1 1 0 00-.707.293l-7 7A1 1 0 003 10h1v7a1 1 0 001 1h4a1 1 0 001-1v-4h2v4a1 1 0 001 1h4a1 1 0 001-1v-7h1a1 1 0 00.707-1.707l-7-7A1 1 0 0010 2z" />
            </svg>
            Home
          </Button>
        </div>
      </div>
    </header>
  );
}
