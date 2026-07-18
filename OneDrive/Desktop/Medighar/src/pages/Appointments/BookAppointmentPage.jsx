import { Clock, GraduationCap, IndianRupee, Stethoscope } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import InfoCard from "@/shared/components/ui/InfoCard.jsx";
import DoctorNotFound from "@/features/doctors/components/DoctorNotFound.jsx";
import { useBookAppointment } from "@/hooks/useBookAppointment.js";
import {
  TIME_SLOTS,
  CONSULTATION_TYPES,
} from "@/services/appointments/appointments.service.js";

const GENDER_OPTIONS = ["Male", "Female", "Other"];

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function TextField({
  label,
  field,
  values,
  errors,
  onChange,
  type = "text",
  min,
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        type={type}
        min={min}
        value={values[field]}
        onChange={(event) => onChange(field, event.target.value)}
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
      />
      <FieldError message={errors[field]} />
    </label>
  );
}

function SelectField({ label, field, values, errors, onChange, options }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <select
        value={values[field]}
        onChange={(event) => onChange(field, event.target.value)}
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.key ?? option} value={option.key ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
      <FieldError message={errors[field]} />
    </label>
  );
}

function TextAreaField({ label, field, values, errors, onChange }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
      <span className="font-medium text-slate-700">{label}</span>
      <textarea
        value={values[field]}
        onChange={(event) => onChange(field, event.target.value)}
        rows={4}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
      />
      <FieldError message={errors[field]} />
    </label>
  );
}

function BookAppointmentPage() {
  const { doctor, notFound, values, errors, updateField, handleSubmit } =
    useBookAppointment();

  if (notFound) {
    return (
      <Section paddingY="py-16 sm:py-20">
        <Container>
          <DoctorNotFound />
        </Container>
      </Section>
    );
  }

  if (!doctor) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Book Appointment"
          subtitle={`Schedule a consultation with ${doctor.name}.`}
          center
        />

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
              {doctor.initials}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {doctor.name}
              </h2>
              <p className="text-sm text-slate-500">{doctor.qualification}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoCard
              icon={GraduationCap}
              label="Qualification"
              value={doctor.qualification}
            />
            <InfoCard
              icon={Stethoscope}
              label="Specialty"
              value={doctor.specialty}
            />
            <InfoCard
              icon={Clock}
              label="Experience"
              value={`${doctor.experienceYears} yrs`}
            />
            <InfoCard
              icon={IndianRupee}
              label="Consultation Fee"
              value={`\u20B9${doctor.fee}`}
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              label="Patient Name"
              field="patientName"
              values={values}
              errors={errors}
              onChange={updateField}
            />
            <TextField
              label="Age"
              field="age"
              type="number"
              values={values}
              errors={errors}
              onChange={updateField}
            />
            <SelectField
              label="Gender"
              field="gender"
              values={values}
              errors={errors}
              onChange={updateField}
              options={GENDER_OPTIONS}
            />
            <TextField
              label="Phone Number"
              field="phone"
              type="tel"
              values={values}
              errors={errors}
              onChange={updateField}
            />
            <TextField
              label="Email"
              field="email"
              type="email"
              values={values}
              errors={errors}
              onChange={updateField}
            />
            <TextField
              label="Appointment Date"
              field="date"
              type="date"
              min={minDate}
              values={values}
              errors={errors}
              onChange={updateField}
            />
            <SelectField
              label="Available Time Slot"
              field="timeSlot"
              values={values}
              errors={errors}
              onChange={updateField}
              options={TIME_SLOTS}
            />
            <SelectField
              label="Consultation Type"
              field="consultationType"
              values={values}
              errors={errors}
              onChange={updateField}
              options={CONSULTATION_TYPES}
            />
            <TextAreaField
              label="Symptoms / Reason for Visit"
              field="reason"
              values={values}
              errors={errors}
              onChange={updateField}
            />
          </div>

          <Button type="submit" size="lg">
            Confirm Appointment
          </Button>
        </form>
      </Container>
    </Section>
  );
}

export default BookAppointmentPage;
