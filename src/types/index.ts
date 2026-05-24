export interface ApiResponse<T> {
  data: T;
  message: string;
  error: null | {
    message: string;
    statusCode: number;
  };
}

export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  degree: string;
  licenseNo: string;
  specialization: string;
  createdAt: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  doctorId: String;
  patientName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  createdAt: string;
}

export interface OpdQueue {
  id: string;
  patientName: string;
  doctorName: string;
  tokenNo: string;
  patientId: string;
  appointmentId: string;
  queueStatus: string;
  appointmentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientName: string;
  doctorName: string;
  patientId: string;
  appointmentId: string;
  height: string;
  weight: string;
  bp: string;
  symptoms: string;
  diagnosis: string;
  prescription: string;
  remarks: string;
  createdAt: string;
}