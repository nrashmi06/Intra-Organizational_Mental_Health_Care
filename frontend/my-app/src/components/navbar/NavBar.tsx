import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ServiceDropdown from "./ServiceDropdown";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const anonymousName = useSelector(
    (state: RootState) => state.auth.anonymousName
  );
  const user = useSelector((state: RootState) => state.auth);
  const role = user.role;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blog/all", label: "Blog" },
    { href: "/helpline", label: "Helpline" },
    { href: "/about", label: "About" },
  ];

  if (role === "ADMIN") {
    navLinks.splice(1, 0, { href: "/insights", label: "Dashboard" });
  }

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium text-white transition-colors hover:text-gray-200",
        "after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform hover:after:scale-x-100",
        router.pathname === href && "after:scale-x-100"
      )}
    >
      {label}
    </Link>
  );

  const ProfileButton = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push("/profile")}
      className="relative group"
    >
      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden transition-shadow group-hover:shadow-lg">
        <span className="text-xl font-bold text-white">
          {anonymousName.charAt(0)}
        </span>
      </div>
      <motion.div
        className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );

  return (
    <header className="sticky top-0 left-0 right-0 z-50">
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800">
        <div className="mx-auto px-4 max-w-7xl">
          <div className="h-16 flex items-center justify-between gap-8">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/images/logo/logo.png"
                  alt="SerenitySphere Logo"
                  width={40}
                  height={40}
                  className="rounded-full transition-transform group-hover:scale-105"
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl font-semibold text-white">
                SerenitySphere
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
              {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
              <ServiceDropdown />
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-4">
              {!user.accessToken ? (
                <>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                    onClick={() => router.push("/signin")}
                  >
                    Sign in
                  </Button>
                  <Button
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => router.push("/signup")}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <ProfileButton />
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-800"
          >
            <div className="bg-gray-900 px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-white py-2 hover:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {!user.accessToken ? (
                <div className="pt-4 space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-white/10"
                    onClick={() => {
                      router.push("/signin");
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign in
                  </Button>
                  <Button
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => {
                      router.push("/signup");
                      setIsMenuOpen(false);
                    }}
                  >
                    Register
                  </Button>
                </div>
              ) : (
                <div className="pt-4">
                  <Button
                    className="w-full text-white hover:bg-white/10"
                    onClick={() => {
                      router.push("/profile");
                      setIsMenuOpen(false);
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
