import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { cn } from "@/lib/utils";

const routes = [
  { label: "Insights", icon: LayoutDashboard, href: "/insights" },
  { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
  { label: "Listener", icon: Headphones, href: "/dashboard/listener" },
  { label: "User", icon: Users, href: "/dashboard/user" },
  { label: "Admin", icon: ShieldCheck, href: "/dashboard/admin" },
  { label: "Sessions", icon: MessageCircle, href: "/dashboard/sessions" },
  { label: "Timeslot", icon: Calendar, href: "/dashboard/timeslot" },
  { label: "Appointments", icon: Pin, href: "/dashboard/appointments" },
  { label: "Helpline", icon: PhoneCall, href: "/dashboard/helpline" },
  { label: "Send Mass Email", icon: Mail, href: "/dashboard/sendemail" },
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
    <div className="flex flex-col h-full">
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-6 border-b border-emerald-600/20">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo/logo.png"
            alt="SerenitySphere Logo"
            width={44}
            height={44}
            className="rounded-full ring-2 ring-emerald-100/20"
          />
          <span className="text-lg font-semibold text-emerald-50">
            SerenitySphere
          </span>
        </div>
        {/* Mobile Close Button */}
        <button
          className="block md:hidden text-emerald-100 p-2 rounded-full hover:bg-emerald-700/50 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out",
              pathname?.includes(route.href)
                ? "bg-emerald-700 text-emerald-50 shadow-sm"
                : "text-emerald-100 hover:bg-emerald-700/40 hover:text-emerald-50"
            )}
          >
            <route.icon className="mr-3 flex-shrink-0 h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-t from-emerald-500 to-emerald-700 shadow-xl">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-emerald-800 to-emerald-900 transform transition-transform duration-300 ease-in-out shadow-2xl",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
    </>
  );
}
