import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Pencil, Trash2, IdCard } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog.jsx";
import DiscoveryHint from "@/shared/components/ui/DiscoveryHint.jsx";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import { useAppointments } from "@/hooks/useAppointments.js";
import { useReminders } from "@/hooks/useReminders.js";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { RELATIONSHIPS } from "@/services/family/family.service.js";

const EMPTY_VALUES = {
  fullName: "",
  relationship: "",
  age: "",
  bloodGroup: "",
  gender: "",
  emergencyContact: "",
  notes: "",
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDER_OPTIONS = ["Male", "Female", "Other"];

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

function MemberForm({
  values,
  errors,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
  bloodGroupLocked,
  emergencyContactLocked,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <h3 className="text-base font-semibold text-slate-900">
        {isEditing ? "Edit Family Member" : "Add Family Member"}
      </h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Full Name</span>
          <input
            id="fullName"
            type="text"
            value={values.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
          <FieldError id="fullName-error" message={errors.fullName} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Relationship</span>
          <select
            id="relationship"
            value={values.relationship}
            onChange={(event) => onChange("relationship", event.target.value)}
            aria-describedby={
              errors.relationship ? "relationship-error" : undefined
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
          >
            <option value="">Select relationship</option>
            {RELATIONSHIPS.map((relationship) => (
              <option key={relationship} value={relationship}>
                {relationship}
              </option>
            ))}
          </select>
          <FieldError id="relationship-error" message={errors.relationship} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Age</span>
          <input
            type="number"
            value={values.age}
            onChange={(event) => onChange("age", event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Blood Group</span>
          <select
            value={values.bloodGroup}
            onChange={(event) => onChange("bloodGroup", event.target.value)}
            disabled={bloodGroupLocked}
            className={`h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none ${
              bloodGroupLocked ? "cursor-not-allowed bg-slate-50 text-slate-400" : ""
            }`}
          >
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {bloodGroupLocked && (
            <span className="text-xs text-slate-500">
              Managed by this member&rsquo;s Medical Profile. Use the
              &ldquo;Medical Profile&rdquo; button on their card to change it.
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Gender</span>
          <select
            value={values.gender}
            onChange={(event) => onChange("gender", event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
          >
            <option value="">Select gender</option>
            {GENDER_OPTIONS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Emergency Contact</span>
          <input
            type="text"
            placeholder="Name · Phone number"
            value={values.emergencyContact}
            onChange={(event) =>
              onChange("emergencyContact", event.target.value)
            }
            disabled={emergencyContactLocked}
            className={`h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none ${
              emergencyContactLocked
                ? "cursor-not-allowed bg-slate-50 text-slate-400"
                : ""
            }`}
          />
          {emergencyContactLocked && (
            <span className="text-xs text-slate-500">
              Managed by this member&rsquo;s Medical Profile. Use the
              &ldquo;Medical Profile&rdquo; button on their card to change it.
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Notes</span>
          <textarea
            value={values.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            rows={3}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">
          {isEditing ? "Save Changes" : "Add Member"}
        </Button>
        {isEditing && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function MemberCard({ member, onEdit, onRequestDelete }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-700">
          {member.fullName?.charAt(0)?.toUpperCase() ?? "?"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-slate-900">
            {member.fullName}
          </p>
          <p className="text-sm text-slate-500">{member.relationship}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
        <span>Blood Group: {member.bloodGroup || "—"}</span>
        <span>Age: {member.age ?? "—"}</span>
        <span className="col-span-2 truncate">
          Emergency: {member.emergencyContact || "—"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/medical-profile?member=${member.id}`)}
          leftIcon={<IdCard className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Medical Profile
        </Button>
        {!member.isSelf && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(member)}
              leftIcon={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRequestDelete(member)}
              leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function FamilyProfilesPage() {
  const { members, create, update, remove } = useFamilyProfiles();

  // Reused, read-only, purely to compute a dependent-data warning before a
  // destructive family-member delete. No new service/repository logic.
  const { upcoming: upcomingAppointments, past: pastAppointments } =
    useAppointments();
  const {
    upcoming: upcomingReminders,
    completed: completedReminders,
    disabled: disabledReminders,
  } = useReminders();
  const { allRecords } = useMedicalRecords();

  const [editingId, setEditingId] = useState(null);
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [bloodGroupLocked, setBloodGroupLocked] = useState(false);
  const [emergencyContactLocked, setEmergencyContactLocked] = useState(false);

  const updateField = (field, value) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const startEdit = (member) => {
    setEditingId(member.id);
    setValues({
      fullName: member.fullName,
      relationship: member.relationship,
      age: member.age ?? "",
      bloodGroup: member.bloodGroup,
      gender: member.gender,
      emergencyContact: member.emergencyContact,
      notes: member.notes,
    });
    setErrors({});
    setBloodGroupLocked(Boolean(member.bloodGroupManagedByMedicalProfile));
    setEmergencyContactLocked(
      Boolean(member.emergencyContactManagedByMedicalProfile),
    );
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setValues(EMPTY_VALUES);
    setErrors({});
    setBloodGroupLocked(false);
    setEmergencyContactLocked(false);
    setShowForm(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = editingId ? update(editingId, values) : create(values);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    resetForm();
  };

  const countDependentRecords = (memberId) => {
    const appointmentsCount = [
      ...upcomingAppointments,
      ...pastAppointments,
    ].filter(
      (appointment) => (appointment.memberId ?? "me") === memberId,
    ).length;
    const remindersCount = [
      ...upcomingReminders,
      ...completedReminders,
      ...disabledReminders,
    ].filter((reminder) => (reminder.memberId ?? "me") === memberId).length;
    const recordsCount = allRecords.filter(
      (record) => (record.memberId ?? "me") === memberId,
    ).length;

    return {
      appointmentsCount,
      remindersCount,
      recordsCount,
      total: appointmentsCount + remindersCount + recordsCount,
    };
  };

  const handleConfirmDelete = () => {
    if (pendingDelete) {
      remove(pendingDelete.id);
      if (editingId === pendingDelete.id) resetForm();
    }
    setPendingDelete(null);
  };

  const dependents = pendingDelete
    ? countDependentRecords(pendingDelete.id)
    : null;
  const dependentWarning =
    dependents && dependents.total > 0
      ? `${pendingDelete.fullName} has ${dependents.total} linked record${dependents.total === 1 ? "" : "s"} (${dependents.appointmentsCount} appointment${dependents.appointmentsCount === 1 ? "" : "s"}, ${dependents.remindersCount} reminder${dependents.remindersCount === 1 ? "" : "s"}, ${dependents.recordsCount} medical record${dependents.recordsCount === 1 ? "" : "s"}). These will remain but will no longer show this member's name.`
      : null;

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Family Health Profiles"
          subtitle="Manage medical information for yourself and your family members."
          center
        />

        <DiscoveryHint
          hintKey="family"
          icon={Users}
          title="Keep everyone's health organized separately"
          description="Add family members here, and their appointments, reminders, and medical records will stay organized under their own name throughout Medighar."
        />

        <div className="mx-auto flex w-full max-w-3xl justify-center">
          <Button
            variant="outline"
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            leftIcon={<Users className="h-4 w-4" aria-hidden="true" />}
          >
            {showForm ? "Hide Form" : "Add Family Member"}
          </Button>
        </div>

        {showForm && (
          <MemberForm
            values={values}
            errors={errors}
            isEditing={editingId !== null}
            onChange={updateField}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            bloodGroupLocked={bloodGroupLocked}
            emergencyContactLocked={emergencyContactLocked}
          />
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={startEdit}
              onRequestDelete={setPendingDelete}
            />
          ))}
        </div>

        <ConfirmDialog
          open={pendingDelete !== null}
          title="Remove this family member?"
          message={
            pendingDelete
              ? `${pendingDelete.fullName} will be removed from your family list. This cannot be undone.`
              : ""
          }
          warning={dependentWarning}
          confirmLabel="Remove Member"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      </Container>
    </Section>
  );
}

export default FamilyProfilesPage;