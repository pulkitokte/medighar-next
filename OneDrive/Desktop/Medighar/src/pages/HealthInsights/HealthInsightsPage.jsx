import {
  CalendarClock,
  CheckCircle2,
  Bell,
  FileText,
  Bookmark,
  Star,
  History,
  Activity,
  Trophy,
  Lock,
  IdCard,
  Users,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { useHealthInsights } from "@/hooks/useHealthInsights.js";
import { NOTIFICATION_CATEGORIES } from "@/services/notifications/notification.service.js";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
      </span>
      <span className="text-2xl font-semibold text-slate-900">{value}</span>
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}

function CircularStat({ label, value, total }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">
      <div
        className="relative flex h-24 w-24 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(#2563eb ${percentage}%, #e2e8f0 ${percentage}% 100%)`,
        }}
      >
        <div className="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full bg-white">
          <span className="text-lg font-semibold text-slate-900">
            {percentage}%
          </span>
        </div>
      </div>
      <span className="text-center text-sm text-slate-600">{label}</span>
    </div>
  );
}

function BarRow({ label, count, max }) {
  const percentage = max > 0 ? Math.round((count / max) * 100) : 0;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-28 shrink-0 truncate text-slate-600">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-slate-500">{count}</span>
    </div>
  );
}

function BarList({ items, labelKey, countKey, emptyMessage }) {
  if (items.length === 0) return <EmptyRelationship message={emptyMessage} />;

  const max = Math.max(...items.map((item) => item[countKey]), 1);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5">
      {items.map((item) => (
        <BarRow
          key={item[labelKey]}
          label={item[labelKey]}
          count={item[countKey]}
          max={max}
        />
      ))}
    </div>
  );
}

function AchievementBadge({ achievement }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border p-5 text-center",
        achievement.unlocked
          ? "border-amber-200 bg-amber-50"
          : "border-slate-200 bg-slate-50",
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          achievement.unlocked
            ? "bg-amber-100 text-amber-600"
            : "bg-slate-200 text-slate-400",
        )}
      >
        {achievement.unlocked ? (
          <Trophy className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Lock className="h-5 w-5" aria-hidden="true" />
        )}
      </span>
      <p
        className={cn(
          "text-sm font-semibold",
          achievement.unlocked ? "text-slate-900" : "text-slate-400",
        )}
      >
        {achievement.label}
      </p>
      <p className="text-xs text-slate-500">{achievement.description}</p>
    </div>
  );
}

function HealthInsightsPage() {
  const insights = useHealthInsights();

  const monthMax = Math.max(
    ...insights.appointments.byMonth.map((month) => month.count),
    1,
  );

  const notificationCategoryItems = NOTIFICATION_CATEGORIES.filter(
    (category) => category.key !== "all",
  ).map((category) => ({
    label: category.label,
    count: insights.notificationStats.byCategory[category.key] ?? 0,
  }));

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-12">
        <PageHeading
          title="Health Insights"
          subtitle="A deterministic summary of your activity across Medighar."
          center
        />

        {insights.summaries.length > 0 && (
          <section className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            {insights.summaries.map((summary) => (
              <p key={summary} className="text-sm font-medium text-blue-800">
                {summary}
              </p>
            ))}
          </section>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Overview Statistics
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={CalendarClock}
              label="Total Appointments"
              value={insights.appointments.total}
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed Appointments"
              value={insights.appointments.completed}
            />
            <StatCard
              icon={CalendarClock}
              label="Upcoming Appointments"
              value={insights.appointments.upcoming}
            />
            <StatCard
              icon={Bell}
              label="Active Medicine Reminders"
              value={insights.reminders.active}
            />
            <StatCard
              icon={FileText}
              label="Total Medical Records"
              value={insights.records.total}
            />
            <StatCard
              icon={Bookmark}
              label="Saved Items"
              value={insights.savedCount}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Appointment Analytics
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="mb-3 text-sm font-medium text-slate-700">
              Appointments by Month
            </p>
            <div className="flex items-end gap-2">
              {insights.appointments.byMonth.map((month) => (
                <div
                  key={month.label}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div className="flex h-24 w-full items-end overflow-hidden rounded-md bg-slate-100">
                    <div
                      className="w-full rounded-md bg-blue-500"
                      style={{ height: `${(month.count / monthMax) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {month.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-700">
                Appointments by Specialty
              </p>
              <BarList
                items={insights.appointments.bySpecialty}
                labelKey="specialty"
                countKey="count"
                emptyMessage="No appointment specialty data yet."
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-700">
                Most Visited Doctors
              </p>
              {insights.appointments.mostVisitedDoctors.length === 0 ? (
                <EmptyRelationship message="No visited doctors yet." />
              ) : (
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                  <BarList
                    items={insights.appointments.mostVisitedDoctors.map(
                      (entry) => ({
                        name: entry.doctor.name,
                        count: entry.count,
                      }),
                    )}
                    labelKey="name"
                    countKey="count"
                    emptyMessage="No visited doctors yet."
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Medical Records Analytics
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-700">
                Records by Type
              </p>
              <BarList
                items={insights.records.byType}
                labelKey="type"
                countKey="count"
                emptyMessage="No medical records yet."
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-700">
                Records by Year
              </p>
              <BarList
                items={insights.records.byYear}
                labelKey="year"
                countKey="count"
                emptyMessage="No medical records yet."
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Reminder Analytics
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={Bell}
              label="Medicine Reminders"
              value={insights.reminders.medicineCount}
            />
            <StatCard
              icon={CalendarClock}
              label="Appointment Reminders"
              value={insights.reminders.appointmentCount}
            />
            <div className="grid grid-cols-3 gap-3 sm:col-span-2 lg:col-span-1">
              <CircularStat
                label="Active"
                value={insights.reminders.active}
                total={insights.reminders.total || 1}
              />
              <CircularStat
                label="Completed"
                value={insights.reminders.completed}
                total={insights.reminders.total || 1}
              />
              <CircularStat
                label="Disabled"
                value={insights.reminders.disabled}
                total={insights.reminders.total || 1}
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Healthcare Activity
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={History}
              label="Recently Viewed"
              value={insights.activity.recentCount}
            />
            <StatCard
              icon={Star}
              label="Reviews Written"
              value={insights.activity.reviewCount}
            />
            <StatCard
              icon={Activity}
              label="Timeline Activity"
              value={insights.timelineActivityCount}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Emergency Medical Profile
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              icon={IdCard}
              label="Profile Completeness"
              value={`${insights.profileCompletion}%`}
            />
            <CircularStat
              label="Medical ID Completeness"
              value={insights.profileCompletion}
              total={100}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Family Health
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              icon={Users}
              label="Family Members"
              value={insights.familyStats.count}
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-700">
                Blood Group Distribution
              </p>
              <BarList
                items={insights.familyStats.bloodGroupDistribution}
                labelKey="bloodGroup"
                countKey="count"
                emptyMessage="No blood group data yet."
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Notifications
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={Bell}
                label="Total Notifications"
                value={insights.notificationStats.total}
              />
              <StatCard
                icon={Bell}
                label="Unread Notifications"
                value={insights.notificationStats.unread}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-700">
                Notifications by Category
              </p>
              <BarList
                items={notificationCategoryItems}
                labelKey="label"
                countKey="count"
                emptyMessage="No notifications yet."
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Achievements</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.key}
                achievement={achievement}
              />
            ))}
          </div>
        </section>
      </Container>
    </Section>
  );
}

export default HealthInsightsPage;
