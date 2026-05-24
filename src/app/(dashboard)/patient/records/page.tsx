"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";

import api from "@/lib/api";
import { MedicalRecord } from "@/types";
import { FileText, Activity } from "lucide-react";

export default function PatientRecordsPage() {
    const router = useRouter();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/patients/medical-records");
        setRecords(res.data.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Medical Records</h1>
          <p className="text-slate-500 mt-1">Your complete health history</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-40 animate-pulse" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <p>No medical records yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Activity size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{record.doctorName}</p>
                      <p className="text-xs text-slate-400">{record.createdAt?.split("T")[0]}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Height", value: record.height },
                    { label: "Weight", value: record.weight },
                    { label: "BP", value: record.bp },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="font-semibold text-slate-700 mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {[
                    { label: "Symptoms", value: record.symptoms },
                    { label: "Diagnosis", value: record.diagnosis },
                    { label: "Prescription", value: record.prescription },
                    { label: "Remarks", value: record.remarks },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-2">
                      <span className="text-xs font-medium text-slate-400 w-24 shrink-0">{item.label}:</span>
                      <span className="text-xs text-slate-600">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}