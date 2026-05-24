"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import api from "@/lib/api";
import { Department, DoctorProfile, PatientProfile } from "@/types";
import { Users, Stethoscope, Building2, Activity } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

function StatCard({ title, value, icon, color, delay }: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800">{count}</p>
      <p className="text-slate-500 text-sm mt-1">{title}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [d, p, dep] = await Promise.all([
          api.get("/admin/doctors"),
          api.get("/admin/patients"),
          api.get("/departments"),
        ]);
        setDoctors(d.data.data);
        setPatients(p.data.data);
        setDepartments(dep.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 h-32 animate-pulse" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Hospital overview</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Doctors" value={doctors.length} icon={<Stethoscope size={22} className="text-blue-600" />} color="bg-blue-50" delay={0.1} />
          <StatCard title="Total Patients" value={patients.length} icon={<Users size={22} className="text-green-600" />} color="bg-green-50" delay={0.2} />
          <StatCard title="Departments" value={departments.length} icon={<Building2 size={22} className="text-purple-600" />} color="bg-purple-50" delay={0.3} />
          <StatCard title="Active Staff" value={doctors.length + 2} icon={<Activity size={22} className="text-orange-600" />} color="bg-orange-50" delay={0.4} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="font-semibold text-slate-800 mb-4">Recent Doctors</h2>
            <div className="space-y-3">
              {doctors.slice(0, 5).map((doc) => (
                <div key={doc.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {doc.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.specialization}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="font-semibold text-slate-800 mb-4">Departments</h2>
            <div className="space-y-3">
              {departments.map((dep) => (
                <div key={dep.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building2 size={16} className="text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{dep.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    dep.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {dep.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}