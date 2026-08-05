import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  History,
  CalendarClock,
  Bell,
  BellRing,
  FileText,
  ChevronRight,
  Stethoscope,
  Pill,
  Activity,
  Store,
  Star,
  IdCard,
  Users,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { useDashboard } from "@/hooks/useDashboard.js";

const TONE_STYLES = {
  sky: { surface: "bg-sky-50", icon: "text-sky-600", iconBg: "bg-sky-100", ring: "hover:border-sky-200" },
  pista: { surface: "bg-lime-50", icon: "text-lime-700", iconBg: "bg-lime-100", ring: "hover:border-lime-200" },
  apricot: { surface: "bg-orange-50", icon: "text-orange-600", iconBg: "bg-orange-100", ring: "hover:border-orange-200" },
  lavender: { surface: "bg-violet-50", icon: "text-violet-600", iconBg: "bg-violet-100", ring: "hover:border-violet-200" },
  mint: { surface: "bg-emerald-50", icon: "text-emerald-600", iconBg: "bg-emerald-100", ring: "hover:border-emerald-200" },
  clay: { surface: "bg-amber-50", icon: "text-amber-700", iconBg: "bg-amber-100", ring: "hover:border-amber-200" },
  mustard: { surface: "bg-yellow-50", icon: "text-yellow-700", iconBg: "bg-yellow-100", ring: "hover:border-yellow-200" },
  slateBlue: { surface: "bg-indigo-50", icon: "text-indigo-600", iconBg: "bg-indigo-100", ring: "hover:border-indigo-200" },
  coral: { surface: "bg-rose-50", icon: "text-rose-600", iconBg: "bg-rose-100", ring: "hover:border-rose-200" },
};

const QUICK_ACTION_TONES = {
  "book-appointment": "sky",
  "browse-doctors": "sky",
  "browse-medicines": "pista",
  "medical-records": "slateBlue",
  "reminder-center": "pista",
  "generate-report": "clay",
  "health-passport": "mint",
};

const SETUP_ITEM_ICONS = {
  "medical-profile": IdCard,
  family: Users,
  appointment: CalendarClock,
  reminder: Bell,
  record: FileText,
  saved: Bookmark,
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
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

function StatTile({ icon: Icon, label, value, to, tone = "mint" }) {
  const navigate = useNavigate();
  const styles = TONE_STYLES[tone];

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      aria-label={`${label}: ${value}. View details.`}
      className={cn(
        "card-surface card-surface-hover transition-premium flex flex-col items-start gap-3 border border-slate-100 bg-white p-5 text-left",
        "hover:-translate-y-0.5",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
        styles.ring,
      )}
    >
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", styles.iconBg)}>
        <Icon className={cn("h-5 w-5", styles.icon)} aria-hidden="true" />
      </span>
      <span className="text-2xl font-semibold tracking-tight text-slate-900">{value}</span>
      <span className="text-sm text-slate-500">{label}</span>
    </button>
  );
}

function QuickActionCard({ action }) {
  const navigate = useNavigate();
  const Icon = action.icon;
  const tone = QUICK_ACTION_TONES[action.key] ?? "mint";
  const styles = TONE_STYLES[tone];

  return (
    <button
      type="button"
      onClick={() => navigate(action.to)}
      className={cn(
        "card-surface card-surface-hover transition-premium flex items-start gap-4 border border-slate-100 bg-white p-5 text-left",
        "hover:-translate-y-0.5",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
        styles.ring,
      )}
    >
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", styles.iconBg)}>
        <Icon className={cn("h-5 w-5", styles.icon)} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-900">{action.label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{action.description}</span>
      </span>
      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
    </button>
  );
}

function ListRow({ icon: Icon, title, subtitle, to, actionLabel = "View", tone = "mint" }) {
  const navigate = useNavigate();
  const styles = TONE_STYLES[tone];

  return (
    <div className="transition-premium flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 hover:shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", styles.iconBg)}>
          <Icon className={cn("h-4.5 w-4.5", styles.icon)} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{title}</p>
          {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={() => navigate(to)} className="shrink-0 rounded-full">
        {actionLabel}
      </Button>
    </div>
  );
}

function DashboardSection({ title, tone, icon: Icon, children }) {
  const styles = TONE_STYLES[tone];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", styles.iconBg)}>
          <Icon className={cn("h-4 w-4", styles.icon)} aria-hidden="true" />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TimelineRow({ event, isLast }) {
  const Icon = event.icon ?? History;

  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-[19px] top-10 h-[calc(100%-2.25rem)] w-px bg-slate-200"
        />
      )}
      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 shadow-sm">
        <Icon className="h-4 w-4 text-emerald-600" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-white p-4">
        <p className="text-sm text-slate-900">{event.message}</p>
        <time
          dateTime={new Date(event.timestamp).toISOString()}
          className="mt-1 block text-xs text-slate-400"
        >
          {formatDateTime(event.timestamp)}
        </time>
      </div>
    </li>
  );
}

function SetupProgressCard({ progress }) {
  return (
    <div className="card-surface flex flex-col gap-3 border border-slate-100 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
            <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          </span>
          Health Setup Progress
        </h2>
        <span className="text-sm font-semibold text-emerald-600">{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-slate-500">
        Complete a few quick steps to get the most out of Medighar.
      </p>
    </div>
  );
}

function ChecklistItemRow({ item }) {
  const navigate = useNavigate();
  const Icon = SETUP_ITEM_ICONS[item.key] ?? FileText;

  return (
    <div className="transition-premium flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 hover:shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        {item.completed ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
        ) : (
          <Circle className="h-5 w-5 shrink-0 text-slate-300" aria-hidden="true" />
        )}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Icon className="h-4.5 w-4.5 text-slate-500" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-sm font-medium",
              item.completed ? "text-slate-400 line-through" : "text-slate-900",
            )}
          >
            {item.label}
          </p>
          <p className="truncate text-xs text-slate-500">{item.description}</p>
        </div>
      </div>

      {!item.completed && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(item.to)}
          className="shrink-0 rounded-full"
        >
          {item.ctaLabel}
        </Button>
      )}
    </div>
  );
}

function SuggestionCard({ suggestion }) {
  const navigate = useNavigate();
  const Icon = SETUP_ITEM_ICONS[suggestion.key] ?? FileText;

  return (
    <button
      type="button"
      onClick={() => navigate(suggestion.to)}
      className="card-surface card-surface-hover transition-premium flex items-start gap-4 border border-dashed border-emerald-200 bg-emerald-50/40 p-5 text-left hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
        <Icon className="h-5 w-5 text-emerald-600" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-900">{suggestion.label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
          {suggestion.description}
        </span>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
          {suggestion.ctaLabel}
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        </span>
      </span>
    </button>
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
    profileCompletion,
    familyMembers,
    recentNotifications,
    setupChecklist,
    setupProgress,
    smartSuggestions,
  } = useDashboard();

  return (
    <Section paddingY="py-14 sm:py-20">
      <Container className="flex flex-col gap-14">
        <PageHeading
          title="Dashboard"
          subtitle="A calm, complete view of your health activity — all in one place."
          center
        />

        {setupProgress < 100 && (
          <section aria-label="Health setup" className="flex flex-col gap-5">
            <SetupProgressCard progress={setupProgress} />

            {smartSuggestions.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                    <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  </span>
                  Suggested for You
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {smartSuggestions.map((suggestion) => (
                    <SuggestionCard key={suggestion.key} suggestion={suggestion} />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-slate-900">Health Setup Checklist</h2>
              <div className="flex flex-col gap-3">
                {setupChecklist.map((item) => (
                  <ChecklistItemRow key={item.key} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section aria-label="Health overview" className="flex flex-col gap-5">
          <h2 className="text-base font-semibold text-slate-900">Health Overview</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
            <StatTile icon={Bookmark} label="Saved Items" value={overview.savedCount} to="/saved" tone="lavender" />
            <StatTile icon={History} label="Recently Viewed" value={overview.recentCount} to="/recent" tone="slateBlue" />
            <StatTile
              icon={CalendarClock}
              label="Upcoming Appointments"
              value={overview.upcomingAppointmentsCount}
              to="/appointments"
              tone="sky"
            />
            <StatTile icon={Bell} label="Active Reminders" value={overview.activeRemindersCount} to="/reminders" tone="pista" />
            <StatTile icon={FileText} label="Medical Records" value={overview.recordsCount} to="/medical-records" tone="slateBlue" />
            <StatTile icon={IdCard} label="Medical ID Complete" value={`${profileCompletion}%`} to="/medical-profile" tone="mint" />
            <StatTile icon={Users} label="Family Members" value={overview.familyMembersCount} to="/family" tone="coral" />
            <StatTile
              icon={BellRing}
              label="Unread Notifications"
              value={overview.unreadNotificationsCount}
              to="/notifications"
              tone="mustard"
            />
          </div>
        </section>

        <section aria-label="Quick actions" className="flex flex-col gap-5">
          <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <QuickActionCard key={action.key} action={action} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <DashboardSection title="Upcoming Appointments" icon={CalendarClock} tone="sky">
            {upcomingAppointments.length === 0 ? (
              <EmptyRelationship message="No upcoming appointments." />
            ) : (
              <div className="flex flex-col gap-3">
                {upcomingAppointments.map((appointment) => (
                  <ListRow
                    key={appointment.id}
                    icon={Stethoscope}
                    title={appointment.doctor?.name ?? "Doctor no longer listed"}
                    subtitle={`${formatDate(appointment.date)} · ${appointment.timeSlot}`}
                    to="/appointments"
                    actionLabel="Quick View"
                    tone="sky"
                  />
                ))}
              </div>
            )}
          </DashboardSection>

          <DashboardSection title="Active Reminders" icon={Bell} tone="pista">
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
                        ? reminder.medicine?.name ?? "Medicine reminder"
                        : reminder.appointment?.doctor?.name ?? "Appointment reminder"
                    }
                    subtitle={
                      reminder.type === "medicine"
                        ? `${reminder.dosage} · ${reminder.frequency}`
                        : reminder.appointment
                          ? `${formatDate(reminder.appointment.date)} · ${reminder.appointment.timeSlot}`
                          : "Linked appointment unavailable"
                    }
                    to="/reminders"
                    tone="pista"
                  />
                ))}
              </div>
            )}
          </DashboardSection>

          <DashboardSection title="Recent Medical Records" icon={FileText} tone="slateBlue">
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
                    tone="slateBlue"
                  />
                ))}
              </div>
            )}
          </DashboardSection>

          <DashboardSection title="Recently Viewed" icon={History} tone="lavender">
            {recentEntries.length === 0 ? (
              <EmptyRelationship message="No recently viewed items." />
            ) : (
              <div className="flex flex-col gap-3">
                {recentEntries.map((entry) => {
                  const ENTRY_ICONS = { doctor: Stethoscope, medicine: Pill, disease: Activity, pharmacy: Store };
                  const ENTRY_TONES = { doctor: "sky", medicine: "pista", disease: "apricot", pharmacy: "lavender" };

                  return (
                    <ListRow
                      key={`${entry.type}-${entry.id}`}
                      icon={ENTRY_ICONS[entry.type] ?? History}
                      title={entry.entity?.name}
                      subtitle={entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      to={entry.to}
                      tone={ENTRY_TONES[entry.type] ?? "lavender"}
                    />
                  );
                })}
              </div>
            )}
          </DashboardSection>

          <DashboardSection title="Recent Notifications" icon={BellRing} tone="mustard">
            {recentNotifications.length === 0 ? (
              <EmptyRelationship message="No notifications yet." />
            ) : (
              <div className="flex flex-col gap-3">
                {recentNotifications.map((notification) => (
                  <ListRow
                    key={notification.id}
                    icon={notification.icon}
                    title={notification.title}
                    subtitle={notification.memberName}
                    to="/notifications"
                    tone="mustard"
                  />
                ))}
              </div>
            )}
          </DashboardSection>

          <DashboardSection title="Family" icon={Users} tone="coral">
            {familyMembers.length === 0 ? (
              <EmptyRelationship message="No family members yet." />
            ) : (
              <div className="flex flex-col gap-3">
                {familyMembers.map((member) => (
                  <ListRow
                    key={member.id}
                    icon={Users}
                    title={member.fullName}
                    subtitle={member.relationship}
                    to="/family"
                    tone="coral"
                  />
                ))}
              </div>
            )}
          </DashboardSection>
        </div>

        <section aria-label="Saved items" className="flex flex-col gap-5">
          <h2 className="text-base font-semibold text-slate-900">Saved Items</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile icon={Stethoscope} label="Doctors" value={saved.savedDoctors.length} to="/saved" tone="sky" />
            <StatTile icon={Pill} label="Medicines" value={saved.savedMedicines.length} to="/saved" tone="pista" />
            <StatTile icon={Activity} label="Diseases" value={saved.savedDiseases.length} to="/saved" tone="apricot" />
            <StatTile icon={Store} label="Pharmacies" value={saved.savedPharmacies.length} to="/saved" tone="lavender" />
          </div>
        </section>

        <section aria-label="Recent activity" className="flex flex-col gap-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
              <Activity className="h-4 w-4 text-amber-700" aria-hidden="true" />
            </span>
            Recent Activity
          </h2>
          {timeline.length === 0 ? (
            <EmptyRelationship message="No activity yet." />
          ) : (
            <ol className="flex flex-col">
              {timeline.map((event, index) => (
                <TimelineRow key={event.id} event={event} isLast={index === timeline.length - 1} />
              ))}
            </ol>
          )}
        </section>
      </Container>
    </Section>
  );
}

export default DashboardPage;