import { useNavigate } from "react-router-dom";
import { Users, Pencil, Trash2, IdCard } from "lucide-react";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import { useFamilyProfiles } from "@/hooks/useFamilyProfiles.js";
import { RELATIONSHIPS } from "@/services/family/family.service.js";
import { useState } from "react";

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

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function MemberForm({
  values,
  errors,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
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
            type="text"
            value={values.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
          <FieldError message={errors.fullName} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Relationship</span>
          <select
            value={values.relationship}
            onChange={(event) => onChange("relationship", event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
          >
            <option value="">Select relationship</option>
            {RELATIONSHIPS.map((relationship) => (
              <option key={relationship} value={relationship}>
                {relationship}
              </option>
            ))}
          </select>
          <FieldError message={errors.relationship} />
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
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
          >
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
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
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
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

function MemberCard({ member, onEdit, onDelete }) {
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
              onClick={() => onDelete(member.id)}
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

  const [editingId, setEditingId] = useState(null);
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

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
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setValues(EMPTY_VALUES);
    setErrors({});
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

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Family Health Profiles"
          subtitle="Manage medical information for yourself and your family members."
          center
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
          />
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={startEdit}
              onDelete={remove}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default FamilyProfilesPage;
