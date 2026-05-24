"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { DoctorProfile, Department } from "@/types";
import { Stethoscope, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    degree: "",
    specialization: "",
    licenseNo: "",
    departmentId: "",
  });

  const fetchData = async () => {
    try {
      const [d, dep] = await Promise.all([
        api.get("/admin/doctors"),
        api.get("/departments"),
      ]);
      setDoctors(d.data.data);
      setDepartments(dep.data.data);
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await api.post("/doctors/register", form);
      toast.success("Doctor registered successfully");
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to register doctor");
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Doctors</h1>
            <p className="text-slate-500 mt-1">Manage hospital doctors</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600 gap-2">
            <Plus size={16} /> Add Doctor
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctors.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">    
                      {doc.name?.charAt(4)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.specialization}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">📧 {doc.email}</p>
                  <p className="text-xs text-slate-500">📞 {doc.phone}</p>
                  <p className="text-xs text-slate-500">🏥 {doc.department}</p>
                  <p className="text-xs text-slate-500">🎓 {doc.degree}</p>
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
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Register Doctor</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {["email", "password", "name", "phone", "degree", "specialization", "licenseNo"].map((field) => (
                  <Input
                    key={field}
                    type={field === "password" ? "password" : "text"}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                ))}
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                  value={form.departmentId}
                  onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>{dep.name}</option>
                  ))}
                </select>
                <Button
                  onClick={handleCreate}
                  disabled={creating}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {creating ? "Registering..." : "Register Doctor"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}