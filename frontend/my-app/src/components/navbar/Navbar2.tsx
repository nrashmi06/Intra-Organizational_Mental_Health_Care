import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ServiceDropdown from "./ServiceDropdown";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const anonymousName = useSelector((state: RootState) => state.auth.anonymousName);
  const user = useSelector((state: RootState) => state.auth);
  const role = user.role;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blog/all", label: "Blog" },
    { href: "/helpline", label: "Helpline" },
    { href: "/about", label: "About" },
  ];

  const serviceLinks = [
    { href: "/match-a-listener", label: "Match with a Listener" },
    { href: "/appointment", label: "Book an Appointment" },
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
    <header className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800">
      <nav className="mx-auto px-4">
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

              {/* Services Section in Mobile */}
              <div className="border-t border-gray-800 pt-4">
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="w-full flex items-center justify-between text-white py-2 hover:text-gray-300"
                >
                  <span>Services</span>
                  {isServicesOpen ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 space-y-2"
                    >
                      {serviceLinks.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="block text-gray-300 py-2 hover:text-white transition-colors duration-200 border-l-2 border-gray-700 pl-4"
                          onClick={() => {
                            setIsServicesOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          {service.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!user.accessToken ? (
                <div className="pt-4 space-y-3 border-t border-gray-800">
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
                <div className="pt-4 border-t border-gray-800">
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
    </header>
  );
}