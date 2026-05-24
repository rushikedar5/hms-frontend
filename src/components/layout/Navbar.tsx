"use client";

import { useRouter } from "next/navigation";
import { getRole, removeToken } from "@/lib/auth";
import { Stethoscope, LogOut, Bell, User } from "lucide-react";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrator",
  DOCTOR: "Doctor Portal",
  PATIENT: "Patient Portal",
  RECEPTIONIST: "Receptionist",
};

export default function Navbar() {
  const router = useRouter();
  const role = getRole();

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
            <Stethoscope size={18} className="text-white" />
          </div>

          <div>
            <h1 className="font-bold text-slate-800 text-lg">
              HMS
            </h1>

            <p className="text-xs text-slate-400">
              {roleLabels[role || ""] || ""}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-3">
          <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition">
            <Bell size={18} className="text-slate-600" />
          </button>

          <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition">
            <User size={18} className="text-slate-600" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={18} />

            <span className="hidden md:block text-sm font-medium">
              Logout
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}