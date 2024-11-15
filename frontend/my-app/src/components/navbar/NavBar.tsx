import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleServicesDropdown = () => setIsServicesDropdownOpen(!isServicesDropdownOpen);

  return (
    <header className="border-b z-50 relative">
      <div
        style={{
          background:
            "linear-gradient(90deg, rgba(179,91,189,1) 0%, rgba(198,91,236,1) 0%, rgba(175,89,189,1) 18%, rgba(22,22,193,1) 41%, rgba(0,212,255,1) 95%)",
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
              className="rounded-full"
            />
            <span className="text-xl font-semibold text-white">SerenitySphere</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:flex-row md:items-center gap-6 md:gap-6 z-20">
            <nav className="flex flex-row items-center gap-6 px-4">
              <Link
                href="/"
                className={`text-sm font-medium text-white ${router.pathname === "/" ? "underline" : ""}`}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className={`text-sm font-medium text-white ${router.pathname === "/blog" ? "underline" : ""}`}
              >
                Blog
              </Link>
              <Link
                href="/helpline"
                className={`text-sm font-medium text-white ${router.pathname === "/helpline" ? "underline" : ""}`}
              >
                Helpline
              </Link>
              
              {/* Services Dropdown */}
              <div className="relative">
                <button
                  className={`text-sm font-medium text-white ${router.pathname.includes('/services') ? "underline" : ""}`}
                  onClick={toggleServicesDropdown}
                >
                  Services
                </button>
                {isServicesDropdownOpen && (
                  <div className="absolute left-0 w-48 mt-2 bg-white text-black rounded-md shadow-lg">
                    <Link
                      href="/listener-application"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Listener Application
                    </Link>
                    <Link
                      href="/appointment"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Appointment
                    </Link>
                    <Link
                      href="/match-a-listener"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Match a Listener
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className={`text-sm font-medium text-white ${router.pathname === "/about" ? "underline" : ""}`}
              >
                About
              </Link>

              {/* Sign-in and Register links */}
              <div className="flex flex-row items-center gap-4">
                <Link href="/sign-in" className="text-sm font-medium text-white">
                  Sign-in
                </Link>
                <Link
                  href="/register"
                  className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Register
                </Link>
              </div>
            </nav>
          </div>

          {/* Hamburger Icon for Mobile */}
          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
          >
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
            <Link
              href="/"
              className={`text-sm font-medium text-white ${router.pathname === "/" ? "underline" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium text-white ${router.pathname === "/blog" ? "underline" : ""}`}
            >
              Blog
            </Link>
            <Link
              href="/helpline"
              className={`text-sm font-medium text-white ${router.pathname === "/helpline" ? "underline" : ""}`}
            >
              Helpline
            </Link>
            <Link
              href="/services"
              className={`text-sm font-medium text-white ${router.pathname === "/services" ? "underline" : ""}`}
            >
              Services
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium text-white ${router.pathname === "/about" ? "underline" : ""}`}
            >
              About
            </Link>

            {/* Sign-in and Register links */}
            <div className="flex flex-col items-center gap-4">
              <Link href="/sign-in" className="text-sm font-medium text-white">
                Sign-in
              </Link>
              <Link
                href="/register"
                className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* SVG Gradient Shape Below the Navbar */}
      <div className="relative bottom-0 w-full left-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <defs>
            <linearGradient id="header-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "rgb(179,91,189)", stopOpacity: 1 }} />
              <stop offset="18%" style={{ stopColor: "rgb(175,89,189)", stopOpacity: 1 }} />
              <stop offset="41%" style={{ stopColor: "rgb(22,22,193)", stopOpacity: 1 }} />
              <stop offset="95%" style={{ stopColor: "rgb(0,212,255)", stopOpacity: 1 }} />
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
