"use client";

import { useRouter, usePathname } from "next/navigation";
import { getRole } from "@/lib/auth";

import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Building2,
  Stethoscope,
  Clock,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: "Queue",
    icon: <Clock size={20} />,
    href: "/patient/queue",
    roles: ["PATIENT"],
  },

  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/admin/dashboard",
    roles: ["ADMIN"],
  },

  {
    label: "Departments",
    icon: <Building2 size={20} />,
    href: "/admin/departments",
    roles: ["ADMIN"],
  },

  {
    label: "Doctors",
    icon: <Stethoscope size={20} />,
    href: "/admin/doctors",
    roles: ["ADMIN"],
  },

  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/doctor/dashboard",
    roles: ["DOCTOR"],
  },

  {
    label: "Queue",
    icon: <ClipboardList size={20} />,
    href: "/doctor/queue",
    roles: ["DOCTOR"],
  },

  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/patient/dashboard",
    roles: ["PATIENT"],
  },

  {
    label: "Appointments",
    icon: <Calendar size={20} />,
    href: "/patient/appointments",
    roles: ["PATIENT"],
  },

  {
    label: "Records",
    icon: <ClipboardList size={20} />,
    href: "/patient/records",
    roles: ["PATIENT"],
  },

  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/receptionist/dashboard",
    roles: ["RECEPTIONIST"],
  },

  {
    label: "Queue",
    icon: <Users size={20} />,
    href: "/receptionist/queue",
    roles: ["RECEPTIONIST"],
  },
];

export default function BottomNav() {
  const router = useRouter();

  const pathname = usePathname();

  const role = getRole();

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(role || "")
  );

  return (
    <div
      className="
        md:hidden
        fixed
        bottom-0
        left-0
        right-0
        z-50
        bg-white/95
        backdrop-blur-md
        border-t
        border-slate-200
        shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
        pb-safe
      "
    >
      <div className="flex items-center justify-around px-2 py-2 overflow-x-auto scrollbar-hide">
        {filteredItems.map((item) => {
          const active = pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`
                min-w-17.5
                flex
                flex-col
                items-center
                justify-center
                gap-1
                px-2
                py-2
                rounded-xl
                transition-all
                duration-200
                ${
                  active
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-500"
                }
              `}
            >
              {item.icon}

              <span className="text-[11px] font-medium whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}