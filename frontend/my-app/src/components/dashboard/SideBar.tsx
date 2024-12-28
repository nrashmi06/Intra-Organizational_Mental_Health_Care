import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Headphones,
  Users,
  ShieldCheck,
  PhoneCall,
  Mail,
  X,
  Pin,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";

const routes = [
  { label: "Home", icon: LayoutDashboard, href: "/analytics" },
  { label: "Scheduler", icon: Calendar, href: "/dashboard/scheduler" },
  { label: "Listener", icon: Headphones, href: "/dashboard/listener" },
  { label: "User", icon: Users, href: "/dashboard/user" },
  { label: "Admin", icon: ShieldCheck, href: "/dashboard/admin" },
  { label: "Sessions", icon: MessageCircle, href: "/dashboard/sessions" },
  { label : "Timeslot", icon: Calendar, href: "/dashboard/timeslot"}, 
  { label: "Appointments", icon: Pin, href: "/dashboard/appointments" },
  { label: "Helpline", icon: PhoneCall, href: "/dashboard/helpline" },
  { label: "Send Mass Email", icon: Mail, href: "/dashboard/sendemail" }
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  const sidebarContent = (
    <>
      {/* Header with Logo */}
      <div className="flex items-center justify-between gap-2 p-4 md:p-0">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo/logo.png"
            alt="SerenitySphere Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-sm md:text-xl font-semibold text-white">
            SerenitySphere
          </span>
        </div>
        {/* Close Button for Mobile */}
        <button
          className="block md:hidden text-white p-2 rounded-md hover:bg-teal-800"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-2 px-2 md:px-0 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
             pathname?.includes(route.href)
                ? "bg-teal-900 text-white"
                : "text-white hover:bg-teal-800 hover:text-white"
            )}
          >
            <route.icon className="mr-3 flex-shrink-0 h-6 w-6 text-white" />
            {route.label}
          </Link>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-teal-700 via-light-green-600 via-light-green-700 to-yellow-200 p-4">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[300px] sm:w-[400px] bg-gradient-to-b from-teal-700 via-light-green-600 via-light-green-700 to-yellow-200 transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
