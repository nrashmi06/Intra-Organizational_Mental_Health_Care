import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store"; // Import RootState to access Redux state

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const anonymousName = useSelector(
    (state: RootState) => state.auth.anonymousName
  );
  const user = useSelector((state: RootState) => state.auth); // Access user data from Redux state
  const role = user.role;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleServicesDropdown = () =>
    setIsServicesDropdownOpen(!isServicesDropdownOpen);

  return (
    <header className="z-20 relative">
      <div className="header">
        <div className="mx-auto px-4 py-4 flex items-center justify-between w-full h-[3.7rem]">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo/logo.png"
              alt="SerenitySphere Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-semibold text-white">
              SerenitySphere
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:flex-row md:items-center gap-6 md:gap-6 z-20">
            <nav className="flex flex-row items-center gap-6 px-4">
              <Link
                href="/"
                className={`text-sm font-medium text-white ${
                  router.pathname === "/" ? "underline" : ""
                }`}
              >
                Home
              </Link>
              {role === "ADMIN" && (
                <Link
                  href="/insights"
                  className={`text-sm font-medium text-white ${
                    router.pathname === "/insights" ? "underline" : ""
                  }`}
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/blog/all"
                className={`text-sm font-medium text-white ${
                  router.pathname === "/blog" ? "underline" : ""
                }`}
              >
                Blog
              </Link>
              <Link
                href="/helpline"
                className={`text-sm font-medium text-white ${
                  router.pathname === "/helpline" ? "underline" : ""
                }`}
              >
                Helpline
              </Link>

              {/* Click-based Dropdown for Services */}
              <div className="relative">
                <button
                  onClick={toggleServicesDropdown}
                  className={`text-sm font-medium text-white ${
                    router.pathname === "/services" ? "underline" : ""
                  }`}
                >
                  Services
                </button>
                {isServicesDropdownOpen && (
                  <div
                    className="absolute left-0 w-48 mt-2 bg-white text-black rounded-md shadow-lg"
                    style={{ zIndex: 20 }}
                  >
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
                    <Link
                      href="/download"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Download My Data
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className={`text-sm font-medium text-white ${
                  router.pathname === "/about" ? "underline" : ""
                }`}
              >
                About
              </Link>

              {/* Sign-in and Register links */}
              <div className="flex flex-row items-center gap-4">
                {!user.accessToken ? (
                  <>
                    <Link
                      href="/signin"
                      className="text-sm font-medium text-white"
                    >
                      Sign-in
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors important"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/profile")}
                    className="text-sm font-medium text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {anonymousName.charAt(0)}
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </nav>
          </div>

          {/* Hamburger Icon for Mobile */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
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
            backgroundColor: "rgba(0,0,0,1)",
            paddingTop: "10px",
            paddingBottom: "10px",
            transition: "all 0.3s ease",
          }}
        >
          <nav className="flex flex-col items-center gap-6 px-4">
            <Link
              href="/"
              className={`text-sm font-medium text-white ${
                router.pathname === "/" ? "underline" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/blog/all"
              className={`text-sm font-medium text-white ${
                router.pathname === "/blog" ? "underline" : ""
              }`}
            >
              Blog
            </Link>
            <Link
              href="/helpline"
              className={`text-sm font-medium text-white ${
                router.pathname === "/helpline" ? "underline" : ""
              }`}
            >
              Helpline
            </Link>

            {/* Mobile Dropdown for Services */}
            <div className="relative">
              <button
                onClick={toggleServicesDropdown}
                className={`text-sm font-medium text-white ${
                  router.pathname === "/services" ? "underline" : ""
                }`}
              >
                Services
              </button>
              {isServicesDropdownOpen && (
                <div
                  className="absolute left-0 w-48 mt-2 bg-white text-black rounded-md shadow-lg"
                  style={{ zIndex: 20 }}
                >
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

            {/* Sign-in and Register links */}
            <div className="flex flex-col items-center gap-4">
              {!user.accessToken ? (
                <>
                  <Link
                    href="/signin"
                    className="text-sm font-medium text-white"
                  >
                    Sign-in
                  </Link>
                  <Link
                    href="/register"
                    className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <Link
                  href="/profile"
                  className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Profile
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
