"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { Appointment, Department } from "@/types";
import { Calendar, Plus, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  BOOKED: "bg-blue-100 text-blue-600",
  CONFIRMED: "bg-green-100 text-green-600",
  COMPLETED: "bg-purple-100 text-purple-600",
  CANCELLED: "bg-red-100 text-red-600",
  SHOWED: "bg-orange-100 text-orange-600",
};

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const fetchData = async () => {
  try {
    const [apt, doc] = await Promise.all([
      api.get("/patients/appointments"),
      api.get("/admin/doctors"),
    ]);
    setAppointments(apt.data.data);
    setDoctors(doc.data.data);
  } catch (err: any) {
    if (err.response?.status === 400) {
      router.push("/patient/profile");
      return;
    }
    toast.error("Failed to fetch data");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async () => {
    setCreating(true);
    try {
      await api.post("/appointments", form);
      toast.success("Appointment booked successfully");
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
            <p className="text-slate-500 mt-1">Manage your appointments</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600 gap-2">
            <Plus size={16} /> Book Appointment
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <p>No appointments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt, i) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Calendar size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">{apt.doctorName}</p>
                      <p className="text-xs text-slate-400">{apt.department}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[apt.status] || "bg-slate-100 text-slate-600"}`}>
                    {apt.status}
                  </span>
                </div>
                <div className="flex gap-4 mt-3 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar size={12} />
                    {apt.appointmentDate}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock size={12} />
                    {apt.appointmentTime}
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
                <h2 className="text-lg font-bold text-slate-800">Book Appointment</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3">
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                  value={form.doctorId}
                  onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialization}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                />
                <input
                  type="time"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                  value={form.appointmentTime}
                  onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                />
                <Button
                  onClick={handleBook}
                  disabled={creating}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {creating ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}