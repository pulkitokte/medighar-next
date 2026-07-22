import {
  FileBarChart,
  FileText,
  CalendarClock,
  Pill,
  Users,
  IdCard,
  Activity,
  Trophy,
  Printer,
} from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { useHealthReports } from "@/hooks/useHealthReports.js";
import {
  REPORT_TYPES,
  REPORT_TYPE_META,
} from "@/services/reports/report.service.js";

const REPORT_TYPE_ICONS = {
  [REPORT_TYPES.COMPLETE_SUMMARY]: FileBarChart,
  [REPORT_TYPES.MEDICAL_RECORDS]: FileText,
  [REPORT_TYPES.APPOINTMENT_HISTORY]: CalendarClock,
  [REPORT_TYPES.MEDICINE_REMINDERS]: Pill,
  [REPORT_TYPES.FAMILY_SUMMARY]: Users,
};

function ReportSection({ title, icon: Icon, children, empty }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      {empty ? <EmptyRelationship message={empty} /> : children}
    </div>
  );
}

function HealthReportsPage() {
  const {
    reportType,
    setReportType,
    memberFilter,
    setMemberFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    members,
    reportPreview,
    hasGenerated,
    generateReport,
    exportPdf,
  } = useHealthReports();

  const meta = REPORT_TYPE_META[reportType];
  const sections = new Set(meta.sections);
  const ReportIcon = REPORT_TYPE_ICONS[reportType];

  return (
    <Section paddingY="py-16 sm:py-20">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #health-report-preview, #health-report-preview * { visibility: visible; }
          #health-report-preview {
            position: fixed;
            inset: 0;
            margin: auto;
            max-width: 100%;
          }
        }
      `}</style>

      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Health Reports"
          subtitle="Generate a printable summary of your health activity."
          center
        />

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 print:hidden">
          <h3 className="text-base font-semibold text-slate-900">
            Report Options
          </h3>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-slate-700">Report Type</span>
              <select
                value={reportType}
                onChange={(event) => setReportType(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
              >
                {Object.entries(REPORT_TYPE_META).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-slate-700">Member</span>
              <select
                value={memberFilter}
                onChange={(event) => setMemberFilter(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
              >
                <option value="all">All Members</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.fullName}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-slate-700">Date Range</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(event) => setDateFrom(event.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(event) => setDateTo(event.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500">{meta.description}</p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={generateReport}>Generate Report</Button>
            <Button
              variant="outline"
              onClick={exportPdf}
              leftIcon={<Printer className="h-4 w-4" aria-hidden="true" />}
              disabled={!hasGenerated}
            >
              Print / Export PDF
            </Button>
            {hasGenerated && (
              <span className="flex items-center text-xs text-green-600">
                Report generated — ready to print or export.
              </span>
            )}
          </div>
        </div>

        <div
          id="health-report-preview"
          className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <ReportIcon
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {meta.label}
              </h2>
              <p className="text-sm text-slate-500">
                {memberFilter === "all"
                  ? "All Members"
                  : (members.find((member) => member.id === memberFilter)
                      ?.fullName ?? "Member")}
                {(dateFrom || dateTo) &&
                  ` · ${dateFrom || "—"} to ${dateTo || "—"}`}
              </p>
            </div>
          </div>

          {sections.has("medicalId") && (
            <ReportSection
              title="Medical ID"
              icon={IdCard}
              empty={
                reportPreview.medicalId.length === 0
                  ? "No medical profile data available."
                  : null
              }
            >
              <div className="flex flex-col gap-3">
                {reportPreview.medicalId.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-slate-100 p-3 text-sm"
                  >
                    <p className="font-medium text-slate-900">
                      {entry.fullName}
                    </p>
                    <p className="text-slate-600">
                      Blood Group: {entry.profile?.bloodGroup || "—"} · Organ
                      Donor: {entry.profile?.organDonor || "—"}
                    </p>
                    <p className="text-slate-600">
                      Emergency Contact:{" "}
                      {entry.profile?.emergencyContactName || "—"}
                      {entry.profile?.emergencyContactNumber &&
                        ` · ${entry.profile.emergencyContactNumber}`}
                    </p>
                  </div>
                ))}
              </div>
            </ReportSection>
          )}

          {sections.has("family") && (
            <ReportSection
              title="Family Members"
              icon={Users}
              empty={
                reportPreview.familyMembers.length === 0
                  ? "No family members."
                  : null
              }
            >
              <ul className="flex flex-col gap-2 text-sm text-slate-600">
                {reportPreview.familyMembers.map((member) => (
                  <li key={member.id}>
                    {member.fullName} — {member.relationship}
                    {member.bloodGroup && ` · ${member.bloodGroup}`}
                  </li>
                ))}
              </ul>
            </ReportSection>
          )}

          {sections.has("appointments") && (
            <ReportSection
              title="Appointments"
              icon={CalendarClock}
              empty={
                reportPreview.appointments.length === 0
                  ? "No appointments in this range."
                  : null
              }
            >
              <ul className="flex flex-col gap-2 text-sm text-slate-600">
                {reportPreview.appointments.map((appointment) => (
                  <li key={appointment.id}>
                    {appointment.doctor?.name ?? "Doctor"} — {appointment.date}{" "}
                    at {appointment.timeSlot} ({appointment.status})
                  </li>
                ))}
              </ul>
            </ReportSection>
          )}

          {sections.has("reminders") && (
            <ReportSection
              title="Medicines & Reminders"
              icon={Pill}
              empty={
                reportPreview.reminders.length === 0
                  ? "No reminders in this range."
                  : null
              }
            >
              <ul className="flex flex-col gap-2 text-sm text-slate-600">
                {reportPreview.reminders.map((reminder) => (
                  <li key={reminder.id}>
                    {reminder.type === "medicine"
                      ? `${reminder.medicine?.name ?? "Medicine"} — ${reminder.dosage} · ${reminder.frequency}`
                      : `Appointment reminder for ${reminder.appointment?.doctor?.name ?? "an appointment"}`}
                  </li>
                ))}
              </ul>
            </ReportSection>
          )}

          {sections.has("records") && (
            <ReportSection
              title="Medical Records"
              icon={FileText}
              empty={
                reportPreview.records.length === 0
                  ? "No records in this range."
                  : null
              }
            >
              <ul className="flex flex-col gap-2 text-sm text-slate-600">
                {reportPreview.records.map((record) => (
                  <li key={record.id}>
                    {record.title} — {record.type} · {record.date}
                  </li>
                ))}
              </ul>
            </ReportSection>
          )}

          {sections.has("activity") && (
            <ReportSection
              title="Recent Activity"
              icon={Activity}
              empty={
                reportPreview.recentActivity.length === 0
                  ? "No recent activity."
                  : null
              }
            >
              <ul className="flex flex-col gap-2 text-sm text-slate-600">
                {reportPreview.recentActivity.map((event) => (
                  <li key={event.id}>{event.title}</li>
                ))}
              </ul>
            </ReportSection>
          )}

          {sections.has("achievements") && (
            <ReportSection
              title="Achievements"
              icon={Trophy}
              empty={
                reportPreview.achievements.filter(
                  (achievement) => achievement.unlocked,
                ).length === 0
                  ? "No achievements unlocked yet."
                  : null
              }
            >
              <ul className="flex flex-col gap-2 text-sm text-slate-600">
                {reportPreview.achievements
                  .filter((achievement) => achievement.unlocked)
                  .map((achievement) => (
                    <li key={achievement.key}>{achievement.label}</li>
                  ))}
              </ul>
            </ReportSection>
          )}

          {sections.has("insights") && (
            <ReportSection
              title="Health Insights Summary"
              icon={FileBarChart}
              empty={
                reportPreview.insightsSummary.length === 0
                  ? "No insights available yet."
                  : null
              }
            >
              <ul className="flex flex-col gap-2 text-sm text-slate-600">
                {reportPreview.insightsSummary.map((summary) => (
                  <li key={summary}>{summary}</li>
                ))}
              </ul>
            </ReportSection>
          )}
        </div>
      </Container>
    </Section>
  );
}

export default HealthReportsPage;
