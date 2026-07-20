import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  IdCard,
  HeartPulse,
  Phone,
  Pill,
  ShieldAlert,
  Printer,
  Trash2,
  RotateCcw,
} from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import { useMedicalProfile } from "@/hooks/useMedicalProfile.js";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import {
  BLOOD_GROUPS,
  GENDER_OPTIONS,
  ORGAN_DONOR_OPTIONS,
  splitListField,
} from "@/services/medicalProfile/medicalProfile.service.js";

const EMPTY_VALUES = {
  fullName: "",
  dob: "",
  bloodGroup: "",
  height: "",
  weight: "",
  gender: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryDoctor: "",
  allergies: "",
  chronicConditions: "",
  currentMedications: "",
  organDonor: "",
  notes: "",
};

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
  span,
}) {
  return (
    <label
      className={`flex flex-col gap-1.5 text-sm ${span ? "sm:col-span-2" : ""}`}
    >
      <span className="font-medium text-slate-700">{label}</span>
      <input
        type={type}
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
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError message={errors[field]} />
    </label>
  );
}

function TextAreaField({ label, field, values, onChange }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
      <span className="font-medium text-slate-700">{label}</span>
      <textarea
        value={values[field]}
        onChange={(event) => onChange(field, event.target.value)}
        rows={3}
        placeholder="Separate multiple entries with commas"
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
      />
    </label>
  );
}

function ListChips({ items }) {
  if (items.length === 0) {
    return <span className="text-sm text-white/70">None listed</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function MedicalIdCard({ profile, completion }) {
  const allergies = splitListField(profile?.allergies);
  const medications = splitListField(profile?.currentMedications);
  const conditions = splitListField(profile?.chronicConditions);

  return (
    <div
      id="medical-id-card"
      className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 p-6 text-white shadow-xl sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            Emergency Medical ID
          </p>
          <h2 className="mt-1 text-2xl font-semibold">
            {profile?.fullName || "Not set"}
          </h2>
          {profile?.gender && (
            <p className="text-sm text-white/80">
              {profile.gender}
              {profile.dob && ` · Born ${profile.dob}`}
            </p>
          )}
        </div>

        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white/15"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0 3px, transparent 3px 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0 3px, transparent 3px 6px)",
          }}
          aria-hidden="true"
        >
          <span className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
            QR
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70">
            Blood Group
          </p>
          <p className="text-lg font-semibold">{profile?.bloodGroup || "—"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70">
            Organ Donor
          </p>
          <p className="text-lg font-semibold">{profile?.organDonor || "—"}</p>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-white/70">
          Emergency Contact
        </p>
        <p className="text-sm font-medium">
          {profile?.emergencyContactName || "Not set"}
          {profile?.emergencyContactNumber &&
            ` · ${profile.emergencyContactNumber}`}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-white/70">
          Allergies
        </p>
        <ListChips items={allergies} />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-white/70">
          Current Medications
        </p>
        <ListChips items={medications} />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-white/70">
          Chronic Conditions
        </p>
        <ListChips items={conditions} />
      </div>

      {profile?.notes && (
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70">
            Notes for Emergency Responders
          </p>
          <p className="text-sm text-white/90">{profile.notes}</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-white/20 pt-3 text-xs text-white/70">
        <span>{completion}% profile complete</span>
        <span>
          Last updated{" "}
          {profile?.updatedAt
            ? new Date(profile.updatedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
      </div>
    </div>
  );
}

function MedicalProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { members } = useFamilyProfiles();
  const selectedMemberId = searchParams.get("member") || "me";

  const { profile, completion, save, remove, reset } =
    useMedicalProfile(selectedMemberId);

  const [isEditing, setIsEditing] = useState(!profile);
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(profile ? { ...EMPTY_VALUES, ...profile } : EMPTY_VALUES);
    setIsEditing(!profile);
    setErrors({});
  }, [profile, selectedMemberId]);

  const updateField = (field, value) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = save(values);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setIsEditing(false);
  };

  const handleDelete = () => {
    remove();
    setValues(EMPTY_VALUES);
    setErrors({});
    setIsEditing(true);
  };

  const handleReset = () => {
    reset();
    setValues(EMPTY_VALUES);
    setErrors({});
    setIsEditing(true);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <Section paddingY="py-16 sm:py-20">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #medical-id-card, #medical-id-card * { visibility: visible; }
          #medical-id-card {
            position: fixed;
            inset: 0;
            margin: auto;
            max-width: 100%;
          }
        }
      `}</style>

      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Emergency Medical Profile"
          subtitle="Keep your critical medical information ready for emergencies."
          center
        />

        <div className="mx-auto flex w-full max-w-xl flex-col gap-1.5 text-sm print:hidden">
          <span className="font-medium text-slate-700">
            Viewing profile for
          </span>
          <select
            value={selectedMemberId}
            onChange={(event) =>
              setSearchParams({ member: event.target.value })
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.fullName}
              </option>
            ))}
          </select>
        </div>

        <MedicalIdCard profile={profile} completion={completion} />

        <div className="mx-auto flex w-full max-w-xl flex-wrap justify-center gap-3 print:hidden">
          <Button
            variant="outline"
            onClick={handlePrint}
            leftIcon={<Printer className="h-4 w-4" aria-hidden="true" />}
          >
            Print Medical ID
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditing((previous) => !previous)}
            leftIcon={<IdCard className="h-4 w-4" aria-hidden="true" />}
          >
            {isEditing ? "Hide Form" : "Edit Profile"}
          </Button>
          {profile && (
            <>
              <Button
                variant="outline"
                onClick={handleReset}
                leftIcon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                onClick={handleDelete}
                leftIcon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
              >
                Delete Profile
              </Button>
            </>
          )}
        </div>

        {isEditing && (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 print:hidden"
          >
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <HeartPulse
                className="h-4 w-4 text-blue-600"
                aria-hidden="true"
              />
              {profile ? "Edit Medical Profile" : "Create Medical Profile"}
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <TextField
                label="Full Name"
                field="fullName"
                values={values}
                errors={errors}
                onChange={updateField}
              />
              <TextField
                label="Date of Birth"
                field="dob"
                type="date"
                values={values}
                errors={errors}
                onChange={updateField}
              />
              <SelectField
                label="Blood Group"
                field="bloodGroup"
                values={values}
                errors={errors}
                onChange={updateField}
                options={BLOOD_GROUPS}
              />
              <TextField
                label="Height (cm)"
                field="height"
                values={values}
                errors={errors}
                onChange={updateField}
              />
              <TextField
                label="Weight (kg)"
                field="weight"
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
                label="Emergency Contact Name"
                field="emergencyContactName"
                values={values}
                errors={errors}
                onChange={updateField}
              />
              <TextField
                label="Emergency Contact Number"
                field="emergencyContactNumber"
                type="tel"
                values={values}
                errors={errors}
                onChange={updateField}
              />
              <TextField
                label="Primary Doctor"
                field="primaryDoctor"
                values={values}
                errors={errors}
                onChange={updateField}
                span
              />

              <TextAreaField
                label="Allergies"
                field="allergies"
                values={values}
                onChange={updateField}
              />
              <TextAreaField
                label="Chronic Conditions"
                field="chronicConditions"
                values={values}
                onChange={updateField}
              />
              <TextAreaField
                label="Current Medications"
                field="currentMedications"
                values={values}
                onChange={updateField}
              />

              <SelectField
                label="Organ Donor"
                field="organDonor"
                values={values}
                errors={errors}
                onChange={updateField}
                options={ORGAN_DONOR_OPTIONS}
              />

              <TextAreaField
                label="Notes for Emergency Responders"
                field="notes"
                values={values}
                onChange={updateField}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit">
                {profile ? "Save Changes" : "Create Profile"}
              </Button>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                Full name, blood group, and emergency contact are required.
              </span>
            </div>
          </form>
        )}
      </Container>
    </Section>
  );
}

export default MedicalProfilePage;
