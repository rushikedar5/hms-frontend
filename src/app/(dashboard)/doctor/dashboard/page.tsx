"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { OpdQueue } from "@/types";
import { Users, Clock, CheckCircle, Activity } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  WAITING: "bg-yellow-100 text-yellow-600",
  IN_PROGRESS: "bg-blue-100 text-blue-600",
  COMPLETED: "bg-green-100 text-green-600",
  CANCELLED: "bg-red-100 text-red-600",
};

export default function DoctorDashboard() {
  const [queue, setQueue] = useState<OpdQueue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const res = await api.get("/doctors/queue");
      setQueue(res.data.data);
    } catch {
      toast.error("Failed to fetch queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const waiting = queue.filter((q) => q.queueStatus === "WAITING");
  const inProgress = queue.filter((q) => q.queueStatus === "IN_PROGRESS");
  const completed = queue.filter((q) => q.queueStatus === "COMPLETED");

  return (
    <DashboardLayout>
      <div className="p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
          <p className="text-slate-500 mt-1">Today's queue overview</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: queue.length, icon: <Users size={20} className="text-blue-600" />, color: "bg-blue-50" },
            { label: "Waiting", value: waiting.length, icon: <Clock size={20} className="text-yellow-600" />, color: "bg-yellow-50" },
            { label: "In Progress", value: inProgress.length, icon: <Activity size={20} className="text-purple-600" />, color: "bg-purple-50" },
            { label: "Completed", value: completed.length, icon: <CheckCircle size={20} className="text-green-600" />, color: "bg-green-50" },
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
          <h2 className="font-semibold text-slate-800 mb-4">Today's Queue</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : queue.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No patients in queue</p>
          ) : (
            <div className="space-y-3">
              {queue.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">#{q.tokenNo}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{q.patientName}</p>
                      <p className="text-xs text-slate-400">{q.appointmentDate}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[q.queueStatus]}`}>
                    {q.queueStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}