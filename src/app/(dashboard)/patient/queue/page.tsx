"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { Clock, CheckCircle, Activity, Users } from "lucide-react";

interface QueueStatus {
  tokenNo: string;
  queueStatus: string;
  doctorName: string;
  position: number;
  totalWaiting: number;
}

export default function PatientQueuePage() {
  const [queueData, setQueueData] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchQueue = async () => {
    try {
      const res = await api.get("/patients/queue");
      setQueueData(res.data.data);
      setLastUpdated(new Date());
    } catch {
      setQueueData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
    WAITING: { color: "text-yellow-600", bg: "bg-yellow-50", icon: <Clock size={32} className="text-yellow-500" />, label: "Waiting" },
    IN_PROGRESS: { color: "text-blue-600", bg: "bg-blue-50", icon: <Activity size={32} className="text-blue-500" />, label: "In Progress" },
    COMPLETED: { color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle size={32} className="text-green-500" />, label: "Completed" },
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Queue Status</h1>
            <p className="text-slate-500 mt-1 text-xs">
              Auto-refreshes every 15 seconds · Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl h-64 animate-pulse" />
        ) : !queueData ? (
          <div className="text-center py-20 text-slate-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p>You are not in any active queue right now</p>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-8 text-center ${statusConfig[queueData.queueStatus]?.bg || "bg-slate-50"}`}
            >
              <div className="flex justify-center mb-4">
                {statusConfig[queueData.queueStatus]?.icon}
              </div>
              <p className="text-6xl font-bold text-slate-800 mb-2">#{queueData.tokenNo}</p>
              <p className={`text-lg font-semibold ${statusConfig[queueData.queueStatus]?.color}`}>
                {statusConfig[queueData.queueStatus]?.label}
              </p>
              <p className="text-slate-500 mt-2">Dr. {queueData.doctorName}</p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
                <p className="text-3xl font-bold text-slate-800">{queueData.position}</p>
                <p className="text-xs text-slate-400 mt-1">Your position</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
                <p className="text-3xl font-bold text-slate-800">{queueData.totalWaiting}</p>
                <p className="text-xs text-slate-400 mt-1">Total waiting</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}