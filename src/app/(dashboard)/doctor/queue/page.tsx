"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { OpdQueue, MedicalRecord } from "@/types";
import { Users, X, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  WAITING: "bg-yellow-100 text-yellow-600",
  IN_PROGRESS: "bg-blue-100 text-blue-600",
  COMPLETED: "bg-green-100 text-green-600",
  CANCELLED: "bg-red-100 text-red-600",
};

export default function DoctorQueuePage() {
  const [queue, setQueue] = useState<OpdQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<OpdQueue | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    height: "",
    weight: "",
    bp: "",
    symptoms: "",
    diagnosis: "",
    prescription: "",
    remarks: "",
  });

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

  const fetchPatientRecords = async (patient: OpdQueue) => {
    setSelectedPatient(patient);
    setRecordsLoading(true);
    try {
      const res = await api.get(`/doctors/patients/${patient.patientId}/records`);
      setRecords(res.data.data);
    } catch {
      setRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleSaveRecord = async () => {
    if (!selectedPatient) return;
    setSaving(true);
    try {
      await api.post("/medical-records", {
        ...form,
        patientId: selectedPatient.patientId,
        appointmentId: selectedPatient.appointmentId,
      });

      await api.put(`/queue/${selectedPatient.id}/status`, { queueStatus: "COMPLETED" });

      toast.success("Record saved and patient marked as completed");
      setSelectedPatient(null);
      setForm({
        height: "",
        weight: "",
        bp: "",
        symptoms: "",
        diagnosis: "",
        prescription: "",
        remarks: "",
      });
      fetchQueue();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save record");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">My Queue</h1>
          <p className="text-slate-500 mt-1">Today's patient queue</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : queue.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p>No patients in queue</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-blue-600 font-bold">#{q.tokenNo}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{q.patientName}</p>
                      <p className="text-xs text-slate-400">{q.appointmentDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {q.queueStatus === "IN_PROGRESS" && (
                      <Button
                        size="sm"
                        onClick={() => fetchPatientRecords(q)}
                        className="bg-blue-500 hover:bg-blue-600 text-xs gap-1"
                      >
                        <FileText size={14} /> View & Add Record
                      </Button>
                    )}
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[q.queueStatus]}`}>
                      {q.queueStatus}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedPatient && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{selectedPatient.patientName}</h2>
                    <p className="text-xs text-slate-400">Token #{selectedPatient.tokenNo}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Visit History */}
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-700 mb-3">Visit History</h3>
                  {recordsLoading ? (
                    <div className="space-y-2">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : records.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-xl">
                      <FileText size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">New patient — no previous records</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {records.map((record) => (
                        <div key={record.id} className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs text-slate-400 mb-2">
                            {record.createdAt?.split("T")[0]}
                          </p>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            {[
                              { label: "Height", value: record.height },
                              { label: "Weight", value: record.weight },
                              { label: "BP", value: record.bp },
                            ].map((item) => (
                              <div key={item.label} className="bg-white rounded-lg p-2 text-center">
                                <p className="text-xs text-slate-400">{item.label}</p>
                                <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs">
                              <span className="text-slate-400">Diagnosis: </span>
                              <span className="text-slate-700">{record.diagnosis}</span>
                            </p>
                            <p className="text-xs">
                              <span className="text-slate-400">Prescription: </span>
                              <span className="text-slate-700">{record.prescription}</span>
                            </p>
                            <p className="text-xs">
                              <span className="text-slate-400">Remarks: </span>
                              <span className="text-slate-700">{record.remarks}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* New Record Form */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Plus size={16} /> New Record
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {["height", "weight", "bp"].map((field) => (
                        <div key={field}>
                          <Label className="text-xs capitalize">{field}</Label>
                          <Input
                            placeholder={
                              field === "bp" ? "120/80" :
                              field === "height" ? "175cm" : "70kg"
                            }
                            value={form[field as keyof typeof form]}
                            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                    {["symptoms", "diagnosis", "prescription", "remarks"].map((field) => (
                      <div key={field}>
                        <Label className="text-xs capitalize">{field}</Label>
                        <Input
                          placeholder={`Enter ${field}`}
                          value={form[field as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    ))}
                    <Button
                      onClick={handleSaveRecord}
                      disabled={saving}
                      className="w-full bg-green-500 hover:bg-green-600 mt-2"
                    >
                      {saving ? "Saving..." : "Save Record & Complete Visit"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}