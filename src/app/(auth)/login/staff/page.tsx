"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { setToken } from "@/lib/auth";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, ArrowLeft } from "lucide-react";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signin", { email, password });
      const token = res.data.data.token;
      setToken(token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (role === "PATIENT") {
        toast.error("Please use the patient login");
        return;
      }

      if (role === "ADMIN") router.push("/admin/dashboard");
      else if (role === "DOCTOR") router.push("/doctor/dashboard");
      else if (role === "RECEPTIONIST") router.push("/receptionist/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm mb-6"
        >
          <ArrowLeft size={16} /> Back to home
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Staff Login</h1>
          <p className="text-slate-500 mt-1">Doctor · Receptionist · Admin</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="staff@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-900 h-11"
          >
            {loading ? "Signing in..." : "Sign In as Staff"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}