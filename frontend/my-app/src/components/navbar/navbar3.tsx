import { useState } from "react";
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Toggle the services dropdown when the Services link is clicked
  const toggleServicesDropdown = () => setIsServicesDropdownOpen(!isServicesDropdownOpen);

  // Toggle the settings dropdown when the Settings link is clicked
  const toggleSettingsDropdown = () => setIsSettingsDropdownOpen(!isSettingsDropdownOpen);

  return (
    <header className="border-b z-50 relative">
      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(224,201,232,1) 0%, rgba(232,204,240,1) 13%, rgba(134,166,238,1) 30%, rgba(202,202,255,1) 58%, rgba(254,216,251,1) 96%)",
        }}
      >
        <div className="mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <img
              src="/images/logo/logo.png"
              alt="SerenitySphere Logo"
              className="w-10 h-10"
            />
            <h1 className="text-2xl font-bold text-purple-800">SerenitySphere</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:flex-row md:items-center gap-6 z-20">
            <nav className="flex flex-row items-center gap-6 px-4">
              <Link href="/" className="text-sm font-medium text-white hover:underline">
                Dashboard
              </Link>
              <Link href="/analytics" className="text-sm font-medium text-white hover:underline">
                Analytics
              </Link>
              <Link
                href="/records"
                className="text-sm font-medium text-white hover:underline"
              >
                Records
              </Link>
              <Link href="/scheduler" className="text-sm font-medium text-white hover:underline">
                Scheduler
              </Link>

              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleSettingsDropdown}
                  className="text-sm font-medium text-white flex items-center"
                >
                  Settings <ChevronDown className="ml-1" />
                </button>
                {isSettingsDropdownOpen && (
                  <div
                    className="absolute left-0 w-48 mt-2 bg-white text-black rounded-md shadow-lg z-10"
                    style={{ zIndex: 1000 }}
                  >
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/logout" className="block px-4 py-2 text-sm hover:bg-gray-100">
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Hamburger Icon for Mobile */}
          <button className="md:hidden text-black" onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12h18M3 6h18M3 18h18"
              ></path>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}
          style={{
            left: "0",
            right: "0",
            top: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingTop: "10px",
            paddingBottom: "10px",
            transition: "all 0.3s ease",
          }}
        >
          <nav className="flex flex-col items-center gap-6 px-4">
            <Link href="/" className="text-sm font-medium text-black hover:underline">
              Dashboard
            </Link>
            <Link href="/analytics" className="text-sm font-medium text-black hover:underline">
              Analytics
            </Link>
            <Link href="/records" className="text-sm font-medium text-black hover:underline">
              Records
            </Link>
            <Link href="/scheduler" className="text-sm font-medium text-black hover:underline">
              Scheduler
            </Link>

            {/* Mobile Settings Dropdown */}
            <div className="relative">
              <button
                onClick={toggleSettingsDropdown}
                className="text-sm font-medium text-black flex items-center"
              >
                Settings <ChevronDown className="ml-1" />
              </button>
              {isSettingsDropdownOpen && (
                <div className="absolute left-0 w-48 mt-2 bg-white text-black rounded-md shadow-lg z-10">
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link href="/logout" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
