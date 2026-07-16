import { BadgeCheck } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import FilterSelect from "@/shared/components/ui/FilterSelect.jsx";
import { SPECIALTIES } from "@/data/doctors/specialties.js";
import { DOCTORS } from "@/data/doctors/doctors.js";

const EXPERIENCE_OPTIONS = ["All", "0-5 yrs", "5-10 yrs", "10+ yrs"];
const GENDER_OPTIONS = ["All", "Male", "Female"];
const CITY_OPTIONS = ["All", ...new Set(DOCTORS.map((doctor) => doctor.city))];

function DoctorFilters({ value, onChange }) {
  const handleFieldChange = (field) => (fieldValue) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const toggleVerified = () => {
    onChange({ ...value, verifiedOnly: !value.verifiedOnly });
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
      <FilterSelect
        label="Specialty"
        value={value.specialty}
        options={["All", ...SPECIALTIES]}
        onChange={handleFieldChange("specialty")}
      />
      <FilterSelect
        label="Experience"
        value={value.experience}
        options={EXPERIENCE_OPTIONS}
        onChange={handleFieldChange("experience")}
      />
      <FilterSelect
        label="Location"
        value={value.location}
        options={CITY_OPTIONS}
        onChange={handleFieldChange("location")}
      />
      <FilterSelect
        label="Gender"
        value={value.gender}
        options={GENDER_OPTIONS}
        onChange={handleFieldChange("gender")}
      />

      <button
        type="button"
        aria-pressed={value.verifiedOnly}
        onClick={toggleVerified}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
          value.verifiedOnly
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
        )}
      >
        <BadgeCheck className="h-4 w-4" aria-hidden="true" />
        Verified Only
      </button>
    </div>
  );
}

export default DoctorFilters;
