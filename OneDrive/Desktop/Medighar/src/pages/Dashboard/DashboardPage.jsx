import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  History,
  CalendarClock,
  Bell,
  FileText,
  ChevronRight,
  Stethoscope,
  Pill,
  Activity,
  Store,
  Star,
} from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { useDashboard } from "@/hooks/useDashboard.js";

const RECENT_TYPE_ICONS = {
  doctor: Stethoscope,
  medicine: Pill,
  disease: Activity,
  pharmacy: Store,
};

const TIMELINE_TYPE_ICONS = {
  appointment: CalendarClock,
  reminder: Bell,
  record: FileText,
  recent: History,
  review: Star,
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatTile({ icon: Icon, label, value, to }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
      </span>
      <span className="text-2xl font-semibold text-slate-900">{value}</span>
      <span className="text-sm text-slate-500">{label}</span>
    </button>
  );
}

function QuickActionCard({ action }) {
  const navigate = useNavigate();
  const Icon = action.icon;

  return (
    <button
      type="button"
      onClick={() => navigate(action.to)}
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-900">
          {action.label}
        </span>
        <span className="block truncate text-xs text-slate-500">
          {action.description}
        </span>
      </span>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-slate-400"
        aria-hidden="true"
      />
    </button>
  );
}

function ListRow({ icon: Icon, title, subtitle, to, actionLabel = "View" }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
          <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{title}</p>
          {subtitle && (
            <p className="truncate text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={() => navigate(to)}>
        {actionLabel}
      </Button>
    </div>
  );
}

function TimelineRow({ event }) {
  const Icon = TIMELINE_TYPE_ICONS[event.type] ?? History;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-900">{event.message}</p>
        <p className="text-xs text-slate-500">
          {formatDateTime(event.timestamp)}
        </p>
      </div>
    </div>
  );
}

function DashboardPage() {
  const {
    overview,
    saved,
    upcomingAppointments,
    activeReminders,
    recentRecords,
    recentEntries,
    timeline,
    quickActions,
  } = useDashboard();

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-12">
        <PageHeading
          title="Dashboard"
          subtitle="Your health activity, all in one place."
          center
        />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatTile
            icon={Bookmark}
            label="Saved Items"
            value={overview.savedCount}
            to="/saved"
          />
          <StatTile
            icon={History}
            label="Recently Viewed"
            value={overview.recentCount}
            to="/recent"
          />
          <StatTile
            icon={CalendarClock}
            label="Upcoming Appointments"
            value={overview.upcomingAppointmentsCount}
            to="/appointments"
          />
          <StatTile
            icon={Bell}
            label="Active Reminders"
            value={overview.activeRemindersCount}
            to="/reminders"
          />
          <StatTile
            icon={FileText}
            label="Medical Records"
            value={overview.recordsCount}
            to="/medical-records"
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <QuickActionCard key={action.key} action={action} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length === 0 ? (
              <EmptyRelationship message="No upcoming appointments." />
            ) : (
              <div className="flex flex-col gap-3">
                {upcomingAppointments.map((appointment) => (
                  <ListRow
                    key={appointment.id}
                    icon={CalendarClock}
                    title={
                      appointment.doctor?.name ?? "Doctor no longer listed"
                    }
                    subtitle={`${formatDate(appointment.date)} · ${appointment.timeSlot}`}
                    to="/appointments"
                    actionLabel="Quick View"
                  />
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Active Reminders
            </h2>
            {activeReminders.length === 0 ? (
              <EmptyRelationship message="No active reminders." />
            ) : (
              <div className="flex flex-col gap-3">
                {activeReminders.map((reminder) => (
                  <ListRow
                    key={reminder.id}
                    icon={reminder.type === "medicine" ? Pill : CalendarClock}
                    title={
                      reminder.type === "medicine"
                        ? (reminder.medicine?.name ?? "Medicine reminder")
                        : (reminder.appointment?.doctor?.name ??
                          "Appointment reminder")
                    }
                    subtitle={
                      reminder.type === "medicine"
                        ? `${reminder.dosage} · ${reminder.frequency}`
                        : reminder.appointment
                          ? `${formatDate(reminder.appointment.date)} · ${reminder.appointment.timeSlot}`
                          : "Linked appointment unavailable"
                    }
                    to="/reminders"
                  />
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Medical Records
            </h2>
            {recentRecords.length === 0 ? (
              <EmptyRelationship message="No medical records yet." />
            ) : (
              <div className="flex flex-col gap-3">
                {recentRecords.map((record) => (
                  <ListRow
                    key={record.id}
                    icon={FileText}
                    title={record.title}
                    subtitle={`${record.doctorName} · ${record.type} · ${formatDate(record.date)}`}
                    to="/medical-records"
                  />
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Recently Viewed
            </h2>
            {recentEntries.length === 0 ? (
              <EmptyRelationship message="No recently viewed items." />
            ) : (
              <div className="flex flex-col gap-3">
                {recentEntries.map((entry) => (
                  <ListRow
                    key={`${entry.type}-${entry.id}`}
                    icon={RECENT_TYPE_ICONS[entry.type] ?? History}
                    title={entry.entity?.name}
                    subtitle={
                      entry.type.charAt(0).toUpperCase() + entry.type.slice(1)
                    }
                    to={entry.to}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Saved Items</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile
              icon={Stethoscope}
              label="Doctors"
              value={saved.savedDoctors.length}
              to="/saved"
            />
            <StatTile
              icon={Pill}
              label="Medicines"
              value={saved.savedMedicines.length}
              to="/saved"
            />
            <StatTile
              icon={Activity}
              label="Diseases"
              value={saved.savedDiseases.length}
              to="/saved"
            />
            <StatTile
              icon={Store}
              label="Pharmacies"
              value={saved.savedPharmacies.length}
              to="/saved"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Activity className="h-5 w-5 text-blue-600" aria-hidden="true" />
            Activity Timeline
          </h2>
          {timeline.length === 0 ? (
            <EmptyRelationship message="No activity yet." />
          ) : (
            <div className="flex flex-col gap-3">
              {timeline.map((event) => (
                <TimelineRow key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </Section>
  );
}

export default DashboardPage;
