"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { OpdQueue } from "@/types";
import { Users, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ReceptionistQueuePage() {
  const [queue, setQueue] = useState<OpdQueue[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [form, setForm] = useState({
    appointmentId: "",
    patientId: "",
    doctorId: "",
  });

  const fetchData = async () => {
    try {
      const [q, p] = await Promise.all([
        api.get("/queue"),
        api.get("/receptionist/patients"),
      ]);
      setQueue(q.data.data);
      setPatients(p.data.data);
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (patientId: string) => {
    try {
      const res = await api.get(`/receptionist/patients/${patientId}/appointments`);
      setAppointments(res.data.data);
    } catch {
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    setSelectedAppointment(null);
    setForm({ appointmentId: "", patientId, doctorId: "" });
    if (patientId) fetchAppointments(patientId);
  };

  const handleAppointmentChange = (appointmentId: string) => {
    const selected = appointments.find((a) => a.id === appointmentId);
    setSelectedAppointment(selected);
    setForm({
      ...form,
      appointmentId,
      doctorId: selected?.doctorId || "",
    });
  };

  const handleAddToQueue = async () => {
    if (!form.appointmentId || !form.patientId || !form.doctorId) {
      toast.error("Please select patient and appointment");
      return;
    }
    setCreating(true);
    try {
      console.log(form);
      await api.post("/queue", form);
      toast.success("Patient added to queue");
      setShowModal(false);
      setForm({ appointmentId: "", patientId: "", doctorId: "" });
      setSelectedPatientId("");
      setSelectedAppointment(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to queue");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/queue/${id}/status`, { queueStatus: status });
      toast.success("Status updated");
      fetchData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">OPD Queue</h1>
            <p className="text-slate-500 mt-1">Manage today's patient queue</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600 gap-2">
            <Plus size={16} /> Add to Queue
          </Button>
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
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-blue-600 font-bold">#{q.tokenNo}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{q.patientName}</p>
                      <p className="text-xs text-slate-400">{q.doctorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {q.queueStatus === "WAITING" && (
                      <>
                        <Button size="sm" onClick={() => handleStatusUpdate(q.id, "IN_PROGRESS")} className="bg-blue-500 hover:bg-blue-600 text-xs">
                          Start
                        </Button>
                        <Button size="sm" onClick={() => handleStatusUpdate(q.id, "CANCELLED")} className="bg-red-500 hover:bg-red-600 text-xs">
                          Cancel
                        </Button>
                      </>
                    )}
                    {q.queueStatus === "IN_PROGRESS" && (
                      <Button size="sm" onClick={() => handleStatusUpdate(q.id, "COMPLETED")} className="bg-green-500 hover:bg-green-600 text-xs">
                        Complete
                      </Button>
                    )}
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      q.queueStatus === "WAITING" ? "bg-yellow-100 text-yellow-600" :
                      q.queueStatus === "IN_PROGRESS" ? "bg-blue-100 text-blue-600" :
                      q.queueStatus === "COMPLETED" ? "bg-green-100 text-green-600" :
                      "bg-red-100 text-red-600"
                    }`}>
                      {q.queueStatus}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Add to Queue</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3">
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                  value={selectedPatientId}
                  onChange={(e) => handlePatientChange(e.target.value)}
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                  value={form.appointmentId}
                  onChange={(e) => handleAppointmentChange(e.target.value)}
                  disabled={!selectedPatientId}
                >
                  <option value="">Select Appointment</option>
                  {appointments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.appointmentDate} — {a.doctorName}
                    </option>
                  ))}
                </select>

                {selectedAppointment && (
                  <div className="bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-600">
                    Doctor: <span className="font-medium">{selectedAppointment.doctorName}</span>
                  </div>
                )}

                <Button
                  onClick={handleAddToQueue}
                  disabled={creating}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {creating ? "Adding..." : "Add to Queue"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}