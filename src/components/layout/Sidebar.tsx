"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

import {
  Clock,
  Menu,
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Building2,
  Stethoscope,
} from "lucide-react";

import { getRole } from "@/lib/auth";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: "Queue Status",
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

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  const role = getRole();

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(role || "")
  );

  return (
    <motion.aside
      animate={{
        width: collapsed ? 80 : 240,
      }}
      transition={{ duration: 0.25 }}
      className="
        hidden
        md:flex
        fixed
        left-0
        top-16
        h-[calc(100vh-64px)]
        bg-white
        border-r
        border-slate-200
        shadow-sm
        flex-col
        z-40
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        {!collapsed && (
          <div>
            <h2 className="font-bold text-blue-600 text-lg">
              HMS
            </h2>

            <p className="text-xs text-slate-400">
              Hospital Portal
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            p-2
            rounded-lg
            hover:bg-slate-100
            transition
          "
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const active = pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-3
                py-3
                rounded-xl
                text-sm
                font-medium
                transition-all
                ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }
              `}
            >
              {item.icon}

              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </motion.aside>
  );
}