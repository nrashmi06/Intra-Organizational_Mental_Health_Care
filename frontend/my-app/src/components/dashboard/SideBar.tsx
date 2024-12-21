//side bar for the dashboard
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
  BookOpenCheck,
  Mail
} from "lucide-react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import Image from "next/image";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboardnew" },
  { label: "Scheduler", icon: Calendar, href: "/dashboard/scheduler" },
  { label: "Blogs", icon: BookOpenCheck, href: "/dashboard/blog" },
  { label: "Listener", icon: Headphones, href: "/dashboard/listener" },
  { label: "User", icon: Users, href: "/dashboard/user" },
  { label: "Admin", icon: ShieldCheck, href: "/dashboard/admin" },
  { label: "Helpline", icon: PhoneCall, href: "/dashboard/helpline" },
  {label: "Send Mass Email", icon: Mail, href: "/dashboard/sendemail"}
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
      <div className="flex items-center gap-2 p-2">
        
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
      
      <nav className="flex-1 mt-2 px-2 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
              pathname === route.href
                ? "bg-indigo-700 text-white"
                : "text-white hover:bg-indigo-600 hover:text-white"
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
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[400px] bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500"
        >
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
