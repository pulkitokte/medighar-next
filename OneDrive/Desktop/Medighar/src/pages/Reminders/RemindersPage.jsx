import { useState } from "react";
import {
  Bell,
  Pill,
  CalendarClock,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog.jsx";
import DiscoveryHint from "@/shared/components/ui/DiscoveryHint.jsx";
import { useReminders } from "@/hooks/useReminders.js";
import { useReminderForm } from "@/hooks/useReminderForm.js";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import {
  FREQUENCY_OPTIONS,
  LEAD_TIME_OPTIONS,
} from "@/services/reminders/reminders.service.js";
import { MEDICINES } from "@/data/medicines/medicines.js";

const STATUS_CLASSES = {
  upcoming: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  disabled: "bg-slate-100 text-slate-500",
};

const STATUS_LABELS = {
  upcoming: "Upcoming",
  completed: "Completed",
  disabled: "Disabled",
};

/**
 * role="alert" makes this an assertive live region on its own — no
 * separate aria-live attribute is needed alongside it. The `id` prop
 * lets each field's form control reference this exact error element via
 * aria-describedby, giving assistive technology an explicit
 * control-to-error relationship in addition to the live announcement.
 */
function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

function MemberSelect({ values, errors, onChange, members }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-slate-700">Family Member</span>
      <select
        id="memberId"
        value={values.memberId}
        onChange={(event) => onChange("memberId", event.target.value)}
        aria-describedby={errors.memberId ? "memberId-error" : undefined}
        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
      >
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.fullName}
          </option>
        ))}
      </select>
      <FieldError id="memberId-error" message={errors.memberId} />
    </label>
  );
}

function TypeToggle({ type, onChange }) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      {[
        { key: "medicine", label: "Medicine Reminder", icon: Pill },
        {
          key: "appointment",
          label: "Appointment Reminder",
          icon: CalendarClock,
        },
      ].map((option) => {
        const Icon = option.icon;
        const isActive = type === option.key;

        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function MedicineReminderFields({ values, errors, onChange, members }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <MemberSelect
        values={values}
        errors={errors}
        onChange={onChange}
        members={members}
      />

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Medicine</span>
        <select
          id="medicineId"
          value={values.medicineId}
          onChange={(event) => onChange("medicineId", event.target.value)}
          aria-describedby={errors.medicineId ? "medicineId-error" : undefined}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
        >
          <option value="">Select medicine</option>
          {MEDICINES.map((medicine) => (
            <option key={medicine.id} value={medicine.id}>
              {medicine.name}
            </option>
          ))}
        </select>
        <FieldError id="medicineId-error" message={errors.medicineId} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Dosage</span>
        <input
          id="dosage"
          type="text"
          placeholder="e.g. 1 tablet"
          value={values.dosage}
          onChange={(event) => onChange("dosage", event.target.value)}
          aria-describedby={errors.dosage ? "dosage-error" : undefined}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
        />
        <FieldError id="dosage-error" message={errors.dosage} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Frequency</span>
        <select
          id="frequency"
          value={values.frequency}
          onChange={(event) => onChange("frequency", event.target.value)}
          aria-describedby={errors.frequency ? "frequency-error" : undefined}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
        >
          {FREQUENCY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError id="frequency-error" message={errors.frequency} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Reminder Time</span>
        <input
          id="reminderTime"
          type="time"
          value={values.reminderTime}
          onChange={(event) => onChange("reminderTime", event.target.value)}
          aria-describedby={
            errors.reminderTime ? "reminderTime-error" : undefined
          }
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
        />
        <FieldError id="reminderTime-error" message={errors.reminderTime} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Start Date</span>
        <input
          id="startDate"
          type="date"
          value={values.startDate}
          onChange={(event) => onChange("startDate", event.target.value)}
          aria-describedby={errors.startDate ? "startDate-error" : undefined}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
        />
        <FieldError id="startDate-error" message={errors.startDate} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">End Date</span>
        <input
          id="endDate"
          type="date"
          value={values.endDate}
          onChange={(event) => onChange("endDate", event.target.value)}
          aria-describedby={errors.endDate ? "endDate-error" : undefined}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
        />
        <FieldError id="endDate-error" message={errors.endDate} />
      </label>
    </div>
  );
}

function AppointmentReminderFields({ values, errors, onChange, members }) {
  const { upcoming } = useAppointments();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <MemberSelect
        values={values}
        errors={errors}
        onChange={onChange}
        members={members}
      />

      <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
        <span className="font-medium text-slate-700">Appointment</span>
        <select
          id="appointmentId"
          value={values.appointmentId}
          onChange={(event) => onChange("appointmentId", event.target.value)}
          aria-describedby={
            errors.appointmentId ? "appointmentId-error" : undefined
          }
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
        >
          <option value="">Select an upcoming appointment</option>
          {upcoming.map((appointment) => (
            <option key={appointment.id} value={appointment.id}>
              {appointment.doctor?.name ?? "Doctor"} —{" "}
              {new Date(appointment.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              at {appointment.timeSlot}
            </option>
          ))}
        </select>
        <FieldError id="appointmentId-error" message={errors.appointmentId} />
        {upcoming.length === 0 && (
          <p className="mt-1 text-xs text-slate-500">
            You have no upcoming appointments to set a reminder for.
          </p>
        )}
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-slate-700">Reminder Time</span>
        <select
          id="leadTime"
          value={values.leadTime}
          onChange={(event) => onChange("leadTime", event.target.value)}
          aria-describedby={errors.leadTime ? "leadTime-error" : undefined}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
        >
          <option value="">Select when to be reminded</option>
          {LEAD_TIME_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldError id="leadTime-error" message={errors.leadTime} />
      </label>
    </div>
  );
}

function ReminderCard({ reminder, onEnable, onDisable, onRequestDelete }) {
  const isAppointment = reminder.type === "appointment";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {isAppointment ? (
            <CalendarClock
              className="h-4 w-4 shrink-0 text-blue-600"
              aria-hidden="true"
            />
          ) : (
            <Pill
              className="h-4 w-4 shrink-0 text-blue-600"
              aria-hidden="true"
            />
          )}
          <span className="text-sm font-semibold text-slate-900">
            {isAppointment
              ? (reminder.appointment?.doctor?.name ?? "Appointment reminder")
              : (reminder.medicine?.name ?? "Medicine reminder")}
          </span>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium",
            STATUS_CLASSES[reminder.status],
          )}
        >
          {STATUS_LABELS[reminder.status]}
        </span>
      </div>

      {reminder.member && !reminder.member.isSelf && (
        <p className="text-xs text-slate-500">For {reminder.member.fullName}</p>
      )}

      {isAppointment ? (
        <div className="flex flex-col gap-1 text-sm text-slate-600">
          <span>
            {reminder.appointment
              ? new Date(reminder.appointment.date).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                )
              : "Appointment no longer available"}
            {reminder.appointment && ` · ${reminder.appointment.timeSlot}`}
          </span>
          <span>
            {
              LEAD_TIME_OPTIONS.find(
                (option) => option.key === reminder.leadTime,
              )?.label
            }
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-1 text-sm text-slate-600">
          <span>
            {reminder.dosage} · {reminder.frequency}
          </span>
          <span>
            {reminder.startDate} to {reminder.endDate} at{" "}
            {reminder.reminderTime}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        {reminder.enabled ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDisable(reminder.id)}
            leftIcon={<PowerOff className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Disable
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEnable(reminder.id)}
            leftIcon={<Power className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Enable
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRequestDelete(reminder)}
          leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

function ReminderSection({
  title,
  reminders,
  emptyMessage,
  onEnable,
  onDisable,
  onRequestDelete,
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

      {reminders.length === 0 ? (
        <EmptyRelationship message={emptyMessage} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEnable={onEnable}
              onDisable={onDisable}
              onRequestDelete={onRequestDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function RemindersPage() {
  const { upcoming, completed, disabled, totalCount, enable, disable, remove } =
    useReminders();
  const { members } = useFamilyProfiles();
  const {
    type,
    setType,
    medicineValues,
    appointmentValues,
    errors,
    updateMedicineField,
    updateAppointmentField,
    handleSubmit,
  } = useReminderForm();

  const [pendingDelete, setPendingDelete] = useState(null);

  const handleConfirmDelete = () => {
    if (pendingDelete) {
      remove(pendingDelete.id);
    }
    setPendingDelete(null);
  };

  const pendingDeleteLabel = pendingDelete
    ? pendingDelete.type === "medicine"
      ? (pendingDelete.medicine?.name ?? "this medicine reminder")
      : `the reminder for ${pendingDelete.appointment?.doctor?.name ?? "your appointment"}`
    : "";

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Reminder Center"
          subtitle="Never miss a dose or an appointment."
          center
        />

        <DiscoveryHint
          hintKey="reminders"
          icon={Bell}
          title="Two kinds of reminders"
          description="Set medicine reminders anytime. Appointment reminders need an existing appointment first — book one from a doctor's profile if you don't have one yet."
        />

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h3 className="text-base font-semibold text-slate-900">
            Create Reminder
          </h3>

          <TypeToggle type={type} onChange={setType} />

          {type === "medicine" ? (
            <MedicineReminderFields
              values={medicineValues}
              errors={errors}
              onChange={updateMedicineField}
              members={members}
            />
          ) : (
            <AppointmentReminderFields
              values={appointmentValues}
              errors={errors}
              onChange={updateAppointmentField}
              members={members}
            />
          )}

          <div>
            <Button type="submit">Create Reminder</Button>
          </div>
        </form>

        {totalCount === 0 ? (
          <EmptyState
            icon={Bell}
            title="No reminders yet."
            description="Create a medicine or appointment reminder above to see it here."
          />
        ) : (
          <div className="flex flex-col gap-12">
            <ReminderSection
              title="Upcoming"
              reminders={upcoming}
              emptyMessage="No upcoming reminders."
              onEnable={enable}
              onDisable={disable}
              onRequestDelete={setPendingDelete}
            />
            <ReminderSection
              title="Completed"
              reminders={completed}
              emptyMessage="No completed reminders."
              onEnable={enable}
              onDisable={disable}
              onRequestDelete={setPendingDelete}
            />
            <ReminderSection
              title="Disabled"
              reminders={disabled}
              emptyMessage="No disabled reminders."
              onEnable={enable}
              onDisable={disable}
              onRequestDelete={setPendingDelete}
            />
          </div>
        )}

        <ConfirmDialog
          open={pendingDelete !== null}
          title="Delete this reminder?"
          message={`This will permanently delete ${pendingDeleteLabel}. This cannot be undone.`}
          confirmLabel="Delete Reminder"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      </Container>
    </Section>
  );
}

export default RemindersPage;
