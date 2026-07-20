import { getDoctorById } from "@/services/doctors/doctors.service.js";
import {
  getAppointments,
  setAppointments,
  subscribeToAppointments,
} from "@/services/appointments/appointments.repository.js";

export { subscribeToAppointments };

export const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
];

export const CONSULTATION_TYPES = [
  { key: "in-person", label: "In Person" },
  { key: "video", label: "Video Consultation" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;

export function validateAppointmentForm(values = {}) {
  const errors = {};

  if (!values.patientName || !values.patientName.trim()) {
    errors.patientName = "Patient name is required.";
  }

  if (!values.age) {
    errors.age = "Age is required.";
  } else {
    const ageNum = Number(values.age);
    if (!Number.isFinite(ageNum) || ageNum <= 0 || ageNum > 120) {
      errors.age = "Enter a valid age.";
    }
  }

  if (!values.gender) {
    errors.gender = "Gender is required.";
  }

  if (!values.phone || !values.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }

  if (!values.email || !values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.date) {
    errors.date = "Appointment date is required.";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(values.date);
    selected.setHours(0, 0, 0, 0);

    if (Number.isNaN(selected.getTime()) || selected <= today) {
      errors.date = "Please select a future date.";
    }
  }

  if (!values.timeSlot) {
    errors.timeSlot = "Please select a time slot.";
  }

  if (!values.consultationType) {
    errors.consultationType = "Please select a consultation type.";
  }

  if (!values.reason || !values.reason.trim()) {
    errors.reason = "Please describe the reason for your visit.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export function deriveAppointmentStatus(appointment) {
  if (appointment.status === "cancelled") return "cancelled";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appointmentDate = new Date(appointment.date);
  appointmentDate.setHours(0, 0, 0, 0);

  return appointmentDate >= today ? "upcoming" : "completed";
}

export function createAppointment(data) {
  const record = {
    id: `appointment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    doctorId: data.doctorId,
    memberId: data.memberId || "me",
    patientName: data.patientName.trim(),
    age: Number(data.age),
    gender: data.gender,
    phone: data.phone.trim(),
    email: data.email.trim(),
    date: data.date,
    timeSlot: data.timeSlot,
    consultationType: data.consultationType,
    reason: data.reason.trim(),
    status: null,
    createdAt: Date.now(),
  };

  setAppointments([record, ...getAppointments()]);

  return record;
}

export function cancelAppointment(id) {
  const next = getAppointments().map((appointment) =>
    appointment.id === id
      ? { ...appointment, status: "cancelled" }
      : appointment,
  );

  setAppointments(next);
}

export function getAllAppointments() {
  return getAppointments();
}
