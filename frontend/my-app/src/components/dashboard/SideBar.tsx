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
      <div className="flex items-center justify-between p-3 border-b border-emerald-600/10">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo/logo.png"
            alt="SerenitySphere Logo"
            width={40}
            height={40}
            className="rounded-full ring-emerald-100/10"
          />
          <span className="text-base font-semibold text-emerald-50">
            SerenitySphere
          </span>
        </div>
        <button
          className="block md:hidden text-emerald-100 p-2 rounded-lg hover:bg-emerald-700/50 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
              pathname?.includes(route.href)
                ? "bg-emerald-700/60 text-white"
                : "text-emerald-100 hover:bg-emerald-700/40 hover:text-white"
            )}
          >
            <route.icon className="mr-3 flex-shrink-0 h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-emerald-800">
          {sidebarContent}
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-emerald-800 transform transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}