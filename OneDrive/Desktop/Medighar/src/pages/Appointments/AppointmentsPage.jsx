import { CalendarClock, Clock, Video, User } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { useAppointments } from "@/hooks/useAppointments.js";
import { CONSULTATION_TYPES } from "@/services/appointments/appointments.service.js";

const STATUS_CLASSES = {
  upcoming: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const STATUS_LABELS = {
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
};

function consultationTypeLabel(key) {
  return CONSULTATION_TYPES.find((type) => type.key === key)?.label ?? key;
}

function AppointmentCard({ appointment, onCancel }) {
  const formattedDate = new Date(appointment.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {appointment.doctor?.initials ?? "?"}
          </span>
          <div>
            <p className="text-base font-semibold text-slate-900">
              {appointment.doctor?.name ?? "Doctor no longer listed"}
            </p>
            <p className="text-sm text-slate-500">
              {appointment.doctor?.specialty}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_CLASSES[appointment.status]}`}
        >
          {STATUS_LABELS[appointment.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <CalendarClock
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {formattedDate}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {appointment.timeSlot}
        </div>
        <div className="flex items-center gap-1.5">
          <Video
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {consultationTypeLabel(appointment.consultationType)}
        </div>
        <div className="flex items-center gap-1.5">
          <User
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {appointment.patientName}
        </div>
      </div>

      {appointment.status === "upcoming" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCancel(appointment.id)}
        >
          Cancel Appointment
        </Button>
      )}
    </div>
  );
}

function AppointmentsSection({ title, appointments, emptyMessage, onCancel }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

      {appointments.length === 0 ? (
        <EmptyRelationship message={emptyMessage} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={onCancel}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function AppointmentsPage() {
  const { upcoming, past, totalCount, cancel } = useAppointments();

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="My Appointments"
          subtitle="Track your upcoming and past consultations."
          center
        />

        {totalCount === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No appointments yet."
            description="Book an appointment from any doctor's profile to see it here."
          />
        ) : (
          <div className="flex flex-col gap-12">
            <AppointmentsSection
              title="Upcoming Appointments"
              appointments={upcoming}
              emptyMessage="No upcoming appointments."
              onCancel={cancel}
            />
            <AppointmentsSection
              title="Past Appointments"
              appointments={past}
              emptyMessage="No past appointments."
              onCancel={cancel}
            />
          </div>
        )}
      </Container>
    </Section>
  );
}

export default AppointmentsPage;
