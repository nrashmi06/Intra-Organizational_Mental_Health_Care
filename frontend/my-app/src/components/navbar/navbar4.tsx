import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { clearUser } from "@/store/authSlice"; // Import the clearUser action

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Toggle the settings dropdown when the Settings link is clicked
  const toggleSettingsDropdown = () => setIsSettingsDropdownOpen(!isSettingsDropdownOpen);

  const handleLogout = () => {
    // Clear the user from Redux store
    dispatch(clearUser());

    // Redirect to the signin page
    router.push("/signin");
  };

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
            <Image
              src="/images/logo/logo.png"
              alt="SerenitySphere Logo"
              width={40}
              height={40}
            />
            <h1 className="text-2xl font-bold text-purple-800">SerenitySphere</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:flex-row md:items-center gap-6 z-20">
            <nav className="flex flex-row items-center gap-6 px-4">
              <Link href="/dashboard" className="text-sm font-medium text-black hover:underline">
                Dashboard
              </Link>
              <Link href="/analytics" className="text-sm font-medium text-black hover:underline">
                Analytics
              </Link>
              <Link href="/blog/all" className="text-sm font-medium text-black hover:underline">
                Blog
              </Link>
              <Link href="/helpline" className="text-sm font-medium text-black hover:underline">
                Helpline
              </Link>

              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleSettingsDropdown}
                  className="text-sm font-medium text-black flex items-center"
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
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      Logout
                    </button>
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
            <Link href="/dashboard" className="text-sm font-medium text-black hover:underline">
              Dashboard
            </Link>
            <Link href="/analytics" className="text-sm font-medium text-black hover:underline">
              Analytics
            </Link>
            <Link href="/blog/all" className="text-sm font-medium text-black hover:underline">
                Blog
              </Link>
              <Link href="/helpline" className="text-sm font-medium text-black hover:underline">
                Helpline
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
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* SVG Gradient Shape Below the Navbar */}
      <div className="relative bottom-0 w-full left-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <defs>
            <linearGradient
              id="header-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "rgb(224,201,232)", stopOpacity: 1 }}
              />
              <stop
                offset="13%"
                style={{ stopColor: "rgb(232,204,240)", stopOpacity: 1 }}
              />
              <stop
                offset="30%"
                style={{ stopColor: "rgb(134,166,238)", stopOpacity: 1 }}
              />
              <stop
                offset="58%"
                style={{ stopColor: "rgb(202,202,255)", stopOpacity: 1 }}
              />
              <stop
                offset="96%"
                style={{ stopColor: "rgb(254,216,251)", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <path
            fill="url(#header-gradient)"
            fillOpacity="0.9"
            d="M0,224L60,197.3C120,171,240,117,360,90.7C480,64,600,64,720,106.7C840,149,960,235,1080,261.3C1200,288,1320,256,1380,240L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>
    </header>
  );
}
