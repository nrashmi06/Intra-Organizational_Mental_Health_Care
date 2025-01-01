import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calendar, Headphones, Users, ShieldCheck,
  PhoneCall, Mail, X, Pin, MessageCircle,
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
    <div className="flex flex-col h-full bg-gradient-to-b from-emerald-800 to-emerald-900 bg-opacity-95 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between p-4 border-b border-emerald-600/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur opacity-30"></div>
              <Image
                src="/images/logo/logo.png"
                alt="SerenitySphere Logo"
                width={40}
                height={40}
                className="relative rounded-full ring-2 ring-emerald-500/20"
              />
            </div>
            <span className="text-base font-semibold text-emerald-50 tracking-wide">
              SerenitySphere
            </span>
          </div>
          <button
            className="block md:hidden text-emerald-100 p-2 rounded-lg hover:bg-emerald-700/50 backdrop-blur-sm transition-all"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative flex-1 px-3 py-4 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-out",
                pathname?.includes(route.href)
                  ? "bg-gradient-to-r from-emerald-600/80 to-emerald-700/80 text-white shadow-lg shadow-emerald-900/20 backdrop-blur-sm"
                  : "text-emerald-100 hover:bg-emerald-700/40 hover:text-white hover:shadow-md hover:shadow-emerald-900/10"
              )}
            >
              <route.icon className="mr-3 flex-shrink-0 h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0">
          {sidebarContent}
        </div>
      </div>
      
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden",
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