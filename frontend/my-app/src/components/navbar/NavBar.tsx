import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { clearUser } from "@/store/authSlice";
import { logout } from "@/service/user/Logout";
import { clearHelplines } from "@/store/emergencySlice";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth);
  const role = user.role;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleServicesDropdown = () =>
    setIsServicesDropdownOpen(!isServicesDropdownOpen);

  const handleLogout = () => {
    router.push("/signin");
    logout(user.accessToken);
    dispatch(clearUser() );
    dispatch(clearHelplines()); 
  };

  return (
    <header className="z-50 relative">
      <div className="header relative z-40">
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
          <div className="hidden md:flex md:flex-row md:items-center gap-6 z-40">
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
                    router.pathname.startsWith("/services") ? "underline" : ""
                  }`}
                >
                  Services
                </button>
                {isServicesDropdownOpen && (
                  <div className="absolute z-50 left-0 w-48 mt-2 bg-white text-black opacity-100 isolate rounded-md shadow-lg">
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
                    onClick={handleLogout}
                    className="text-sm font-medium text-white bg-black px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Logout
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
          className={`md:hidden ${
            isMenuOpen ? "block" : "hidden"
          } absolute w-full bg-black`}
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
                  router.pathname.startsWith("/services") ? "underline" : ""
                }`}
              >
                Services
              </button>
              {isServicesDropdownOpen && (
                <div className="absolute z-50 left-0 w-48 mt-2 bg-white text-black opacity-100 isolate rounded-md shadow-lg">
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
          </nav>
        </div>
      </div>

      {/* SVG Gradient Shape Below the Navbar */}
      <div className="relative bottom-0 w-full left-0 z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-full"
        >
          <linearGradient
            id="header-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "rgba(228,232,46,1)" }} />
            <stop
              offset="26%"
              style={{ stopColor: "rgba(82,180,30,0.8708551483420593)" }}
            />
            <stop
              offset="47%"
              style={{ stopColor: "rgba(64,175,105,0.9197207678883071)" }}
            />
            <stop offset="83%" style={{ stopColor: "rgb(36, 121, 104)" }} />
          </linearGradient>
          <path
            fill="url(#header-gradient)"
            style={{ mixBlendMode: "soft-light", opacity: 0.7 }}
            d="M0,224L60,197.3C120,171,240,117,360,90.7C480,64,600,64,720,106.7C840,149,960,235,1080,261.3C1200,288,1320,256,1380,240L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>
      </div>
    </header>
  );
}
