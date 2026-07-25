import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Siren,
  Printer,
  Download,
  Share2,
  Copy,
  FileText,
  IdCard,
  Pill,
  ShieldAlert,
  Activity,
  Stethoscope,
  Syringe,
  Users,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { useHealthPassport } from "@/hooks/useHealthPassport.js";

function PassportSection({ title, icon: Icon, children, empty }) {
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

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value || "—"}</span>
    </div>
  );
}

function HealthPassportPage() {
  const navigate = useNavigate();
  const {
    members,
    memberId,
    setMemberId,
    passportData,
    age,
    emergencyMode,
    setEmergencyMode,
    hasGenerated,
    generatePassport,
    printPassportAction,
    copyEmergencyInfo,
    sharePassport,
  } = useHealthPassport();

  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!statusMessage) return undefined;
    const timeout = setTimeout(() => setStatusMessage(""), 2500);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  const handleCopy = async () => {
    const success = await copyEmergencyInfo();
    setStatusMessage(
      success
        ? "Emergency information copied to clipboard."
        : "Unable to copy. Please try again.",
    );
  };

  const handleShare = async () => {
    const success = await sharePassport();
    setStatusMessage(
      success
        ? "Emergency information shared."
        : "Sharing isn't supported on this device.",
    );
  };

  const { medicalId } = passportData;

  return (
    <Section paddingY="py-16 sm:py-20">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #health-passport-preview, #health-passport-preview * { visibility: visible; }
          #health-passport-preview {
            position: fixed;
            inset: 0;
            margin: auto;
            max-width: 100%;
          }
        }
      `}</style>

      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Health Passport"
          subtitle="Your complete medical summary, ready for emergencies."
          center
        />

        <p role="status" aria-live="polite" className="sr-only">
          {statusMessage}
        </p>

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-slate-700">
                Viewing Passport For
              </span>
              <select
                value={memberId}
                onChange={(event) => setMemberId(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.fullName}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              role="switch"
              aria-checked={emergencyMode}
              onClick={() => setEmergencyMode((previous) => !previous)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                emergencyMode
                  ? "border-red-600 bg-red-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              <Siren className="h-4 w-4" aria-hidden="true" />
              {emergencyMode ? "Emergency Mode: On" : "Enable Emergency Mode"}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={generatePassport}>Generate Passport</Button>
            <Button
              variant="outline"
              onClick={printPassportAction}
              leftIcon={<Printer className="h-4 w-4" aria-hidden="true" />}
            >
              Print Passport
            </Button>
            <Button
              variant="outline"
              onClick={printPassportAction}
              leftIcon={<Download className="h-4 w-4" aria-hidden="true" />}
            >
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              leftIcon={<Share2 className="h-4 w-4" aria-hidden="true" />}
            >
              Share
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              leftIcon={<Copy className="h-4 w-4" aria-hidden="true" />}
            >
              Copy Emergency Info
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/medical-records")}
            >
              Open Medical Records
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate(`/medical-profile?member=${memberId}`)}
            >
              Open Medical Profile
            </Button>
            {hasGenerated && (
              <span className="flex items-center text-xs text-green-600">
                Passport generated.
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500">
            &ldquo;Download PDF&rdquo; uses your browser&rsquo;s print-to-PDF
            option, since no dedicated PDF engine is bundled with this app yet.
          </p>
        </div>

        <div
          id="health-passport-preview"
          className={cn(
            "mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border p-6 sm:p-8",
            emergencyMode
              ? "border-red-600 bg-white text-lg [&_*]:leading-relaxed"
              : "border-slate-200 bg-white",
          )}
        >
          <div className="flex flex-col items-center gap-4 border-b border-slate-200 pb-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl",
                  emergencyMode
                    ? "bg-red-600 text-white"
                    : "bg-blue-50 text-blue-600",
                )}
              >
                <IdCard
                  className={emergencyMode ? "h-8 w-8" : "h-7 w-7"}
                  aria-hidden="true"
                />
              </span>
              <div>
                <h2
                  className={cn(
                    "font-bold text-slate-900",
                    emergencyMode ? "text-2xl" : "text-xl",
                  )}
                >
                  {medicalId.fullName || "Unnamed"}
                </h2>
                <p className="text-sm text-slate-500">
                  {age !== null ? `${age} years` : "Age unknown"}
                  {medicalId.gender && ` · ${medicalId.gender}`}
                </p>
              </div>
            </div>

            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(15,23,42,0.4) 0 3px, transparent 3px 6px), repeating-linear-gradient(90deg, rgba(15,23,42,0.4) 0 3px, transparent 3px 6px)",
              }}
              aria-hidden="true"
            >
              <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                QR
              </span>
            </div>
          </div>

          <div
            className={cn(
              "grid grid-cols-1 gap-4 rounded-2xl p-5 sm:grid-cols-2",
              emergencyMode
                ? "border-2 border-red-600 bg-red-50"
                : "border border-amber-200 bg-amber-50",
            )}
          >
            <InfoRow label="Blood Group" value={medicalId.bloodGroup} />
            <InfoRow label="Organ Donor" value={medicalId.organDonor} />
            <InfoRow
              label="Emergency Contact"
              value={
                medicalId.emergencyContactName
                  ? `${medicalId.emergencyContactName}${medicalId.emergencyContactNumber ? ` · ${medicalId.emergencyContactNumber}` : ""}`
                  : ""
              }
            />
            <InfoRow label="Primary Doctor" value={medicalId.primaryDoctor} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="Height" value={medicalId.height} />
            <InfoRow label="Weight" value={medicalId.weight} />
          </div>

          {passportData.recentAppointment && (
            <PassportSection title="Most Recent Appointment" icon={Stethoscope}>
              <p className="text-sm text-slate-600">
                {passportData.recentAppointment.doctor?.name ?? "Doctor"} —{" "}
                {passportData.recentAppointment.date}
              </p>
            </PassportSection>
          )}

          <PassportSection
            title="Current Medicines"
            icon={Pill}
            empty={
              passportData.currentMedicines.length === 0
                ? "No active medicine reminders."
                : null
            }
          >
            <ul className="flex flex-col gap-2 text-sm text-slate-600">
              {passportData.currentMedicines.map((medicine) => (
                <li key={medicine.id}>
                  {medicine.name} — {medicine.dosage} · {medicine.frequency}
                </li>
              ))}
            </ul>
          </PassportSection>

          <PassportSection
            title="Active Allergies"
            icon={ShieldAlert}
            empty={
              passportData.allergies.length === 0
                ? "No allergies listed."
                : null
            }
          >
            <ul className="flex flex-wrap gap-2">
              {passportData.allergies.map((allergy) => (
                <li
                  key={allergy}
                  className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700"
                >
                  {allergy}
                </li>
              ))}
            </ul>
          </PassportSection>

          <PassportSection
            title="Chronic Diseases"
            icon={Activity}
            empty={
              passportData.chronicConditions.length === 0
                ? "No chronic conditions listed."
                : null
            }
          >
            <ul className="flex flex-col gap-2 text-sm text-slate-600">
              {passportData.chronicConditions.map((condition) => (
                <li key={condition.name}>
                  {condition.diseaseLink ? (
                    <button
                      type="button"
                      onClick={() => navigate(condition.diseaseLink)}
                      className="text-blue-600 underline-offset-2 hover:underline"
                    >
                      {condition.name}
                    </button>
                  ) : (
                    condition.name
                  )}
                </li>
              ))}
            </ul>
          </PassportSection>

          <PassportSection
            title="Past Surgeries"
            icon={Activity}
            empty={
              passportData.pastSurgeries.length === 0
                ? "No surgical history found in your medical records."
                : null
            }
          >
            <p className="mb-2 text-xs text-slate-400">
              Matched by keyword from your medical records.
            </p>
            <ul className="flex flex-col gap-2 text-sm text-slate-600">
              {passportData.pastSurgeries.map((record) => (
                <li key={record.id}>
                  {record.title} — {record.date} · {record.hospital}
                </li>
              ))}
            </ul>
          </PassportSection>

          <PassportSection
            title="Vaccination Summary"
            icon={Syringe}
            empty={
              passportData.vaccinations.length === 0
                ? "No vaccination records found."
                : null
            }
          >
            <ul className="flex flex-col gap-2 text-sm text-slate-600">
              {passportData.vaccinations.map((record) => (
                <li key={record.id}>
                  {record.title} — {record.date} · {record.hospital}
                </li>
              ))}
            </ul>
          </PassportSection>

          <PassportSection
            title="Insurance Details"
            icon={ShieldCheck}
            empty="Not available yet."
          >
            <div />
          </PassportSection>

          <PassportSection
            title="Family History Summary"
            icon={Users}
            empty={
              passportData.familyHistory.length === 0
                ? "No family members added yet."
                : null
            }
          >
            <ul className="flex flex-col gap-2 text-sm text-slate-600">
              {passportData.familyHistory.map((member) => (
                <li key={member.id}>
                  {member.fullName} — {member.relationship}
                  {member.bloodGroup && ` · ${member.bloodGroup}`}
                </li>
              ))}
            </ul>
          </PassportSection>

          {medicalId.notes && (
            <PassportSection
              title="Notes for Emergency Responders"
              icon={FileText}
            >
              <p className="text-sm text-slate-600">{medicalId.notes}</p>
            </PassportSection>
          )}
        </div>
      </Container>
    </Section>
  );
}

export default HealthPassportPage;
