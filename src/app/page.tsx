"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  Stethoscope,
  Calendar,
  Users,
  ClipboardList,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Calendar size={24} className="text-blue-600" />,
    title: "Smart Appointments",
    description:
      "Book appointments online or walk-in. No more long waiting in queues.",
    color: "bg-blue-50",
  },

  {
    icon: <ClipboardList size={24} className="text-green-600" />,
    title: "Digital Medical Records",
    description:
      "Complete health history at your fingertips. Every visit, every diagnosis.",
    color: "bg-green-50",
  },

  {
    icon: <Users size={24} className="text-purple-600" />,
    title: "OPD Queue Management",
    description:
      "Real-time token system. Know exactly when it's your turn.",
    color: "bg-purple-50",
  },

  {
    icon: <Shield size={24} className="text-orange-600" />,
    title: "Secure & Private",
    description:
      "Your health data is encrypted and protected at every step.",
    color: "bg-orange-50",
  },
];

const stats = [
  { value: "10K+", label: "Patients Served" },
  { value: "500+", label: "Doctors" },
  { value: "50+", label: "Departments" },
  { value: "99%", label: "Satisfaction" },
];

const roles = [
  {
    title: "Patient",
    description: "Book appointments & view records",
    icon: "🏥",
    href: "/login/patient",
  },

  {
    title: "Doctor",
    description: "Manage queue & patient records",
    icon: "👨‍⚕️",
    href: "/login/staff",
  },

  {
    title: "Receptionist",
    description: "Handle walk-ins & queue",
    icon: "💼",
    href: "/login/staff",
  },

  {
    title: "Admin",
    description: "Manage hospital operations",
    icon: "⚙️",
    href: "/login/staff",
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
              <Stethoscope size={18} className="text-white" />
            </div>

            <span className="font-bold text-slate-800 text-lg">
              HMS
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => router.push("/login/patient")}
              className="hidden sm:flex"
            >
              Patient Login
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/login/staff")}
              className="hidden md:flex"
            >
              Staff Login
            </Button>

            <Button
              onClick={() => router.push("/register")}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 bg-linear-to-br from-slate-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
                <CheckCircle size={14} />
                Smart Hospital Management
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
                Modern Healthcare,
                <span className="text-blue-500 block">
                  Simplified
                </span>
              </h1>

              <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                A complete hospital management system that connects patients, doctors, and staff in one seamless platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => router.push("/register")}
                  className="bg-blue-500 hover:bg-blue-600 gap-2 h-12 px-6"
                >
                  Register as Patient
                  <ArrowRight size={16} />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/login/staff")}
                  className="h-12 px-6"
                >
                  Staff Login
                </Button>
              </div>
            </motion.div>

            {/* Right Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full"
            >
              <div className="relative">
                
                <div className="bg-white rounded-3xl shadow-xl p-5 md:p-6 border border-slate-100">
                  
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Clock size={18} className="text-blue-600" />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-700">
                        Today's Queue
                      </p>

                      <p className="text-xs text-slate-400">
                        Live updates
                      </p>
                    </div>

                    <div className="ml-auto flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />

                      <span className="text-xs text-green-600">
                        Live
                      </span>
                    </div>
                  </div>

                  {[
                    {
                      token: "01",
                      name: "Rahul Patil",
                      status: "IN_PROGRESS",
                      color: "bg-blue-100 text-blue-600",
                    },

                    {
                      token: "02",
                      name: "Sneha Kulkarni",
                      status: "WAITING",
                      color: "bg-yellow-100 text-yellow-600",
                    },

                    {
                      token: "03",
                      name: "Vikram Desai",
                      status: "WAITING",
                      color: "bg-yellow-100 text-yellow-600",
                    },

                    {
                      token: "04",
                      name: "Pooja Sharma",
                      status: "WAITING",
                      color: "bg-yellow-100 text-yellow-600",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-2"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-blue-600 font-bold text-xs">
                            #{item.token}
                          </span>
                        </div>

                        <p className="text-sm font-medium text-slate-700 truncate">
                          {item.name}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${item.color}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 md:py-16 px-4 md:px-6 bg-blue-500">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">
                  {stat.value}
                </p>

                <p className="text-blue-100 text-sm mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Everything You Need
            </h2>

            <p className="text-slate-500 max-w-2xl mx-auto">
              A complete platform built for modern hospitals and healthcare providers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition"
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  {feature.icon}
                </div>

                <h3 className="font-semibold text-slate-800 mb-2">
                  {feature.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Built for Everyone
            </h2>

            <p className="text-slate-500">
              One platform, four powerful roles.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role, i) => (
              <div
                key={i}
                onClick={() => router.push(role.href)}
                className="bg-white rounded-2xl p-5 md:p-6 text-center shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer"
              >
                <div className="text-3xl mb-3">
                  {role.icon}
                </div>

                <h3 className="font-semibold text-slate-800 mb-1">
                  {role.title}
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
          
          <div className="bg-blue-500 rounded-3xl p-6 md:p-8 text-white">
            <div className="text-4xl mb-4">🏥</div>

            <h3 className="text-2xl font-bold mb-3">
              Are you a Patient?
            </h3>

            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Book appointments, track your queue, and access your medical history anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push("/register")}
                className="bg-white text-blue-500 hover:bg-blue-50"
              >
                Register
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/login/patient")}
                className="border-white text-white hover:bg-blue-600"
              >
                Sign In
              </Button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-3xl p-6 md:p-8 text-white">
            <div className="text-4xl mb-4">👨‍⚕️</div>

            <h3 className="text-2xl font-bold mb-3">
              Are you Staff?
            </h3>

            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Doctors, receptionists, and admins — manage your hospital operations seamlessly.
            </p>

            <Button
              onClick={() => router.push("/login/staff")}
              className="bg-white text-slate-800 hover:bg-slate-100"
            >
              Staff Login
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center">
              <Stethoscope size={14} className="text-white" />
            </div>

            <span className="font-bold text-slate-700">
              HMS
            </span>
          </div>

          <p className="text-slate-400 text-sm text-center">
            © 2026 Hospital Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}