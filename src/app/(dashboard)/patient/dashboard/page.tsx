"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { Appointment } from "@/types";
import { Calendar, Clock, Stethoscope, FileText } from "lucide-react";

export default function PatientDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/patients/appointments");
        setAppointments(res.data.data);
      } catch (err: any) {
        if (err.response?.status === 400) {
          router.push("/patient/profile");
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const upcoming = appointments.filter((a) => a.status === "BOOKED" || a.status === "CONFIRMED");
  const completed = appointments.filter((a) => a.status === "COMPLETED");

  return (
    <DashboardLayout>
      <div className="p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">My Dashboard</h1>
          <p className="text-slate-500 mt-1">Your health overview</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Appointments", value: appointments.length, icon: <Calendar size={20} className="text-blue-600" />, color: "bg-blue-50" },
            { label: "Upcoming", value: upcoming.length, icon: <Clock size={20} className="text-green-600" />, color: "bg-green-50" },
            { label: "Completed", value: completed.length, icon: <Stethoscope size={20} className="text-purple-600" />, color: "bg-purple-50" },
            { label: "Records", value: completed.length, icon: <FileText size={20} className="text-orange-600" />, color: "bg-orange-50" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
            >
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h2 className="font-semibold text-slate-800 mb-4">Upcoming Appointments</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Stethoscope size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{apt.doctorName}</p>
                      <p className="text-xs text-slate-400">{apt.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">{apt.appointmentDate}</p>
                    <p className="text-xs text-slate-400">{apt.appointmentTime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}