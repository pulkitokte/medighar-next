import { Biohazard } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import FilterSelect from "@/shared/components/ui/FilterSelect.jsx";
import { DISEASE_CATEGORIES } from "@/data/diseases/categories.js";

const SEVERITY_OPTIONS = ["All", "Mild", "Moderate", "Severe"];

function DiseaseFilters({ value, onChange }) {
  const handleFieldChange = (field) => (fieldValue) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const toggleContagious = () => {
    onChange({ ...value, contagiousOnly: !value.contagiousOnly });
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
      <FilterSelect
        label="Category"
        value={value.category}
        options={["All", ...DISEASE_CATEGORIES]}
        onChange={handleFieldChange("category")}
      />
      <FilterSelect
        label="Severity"
        value={value.severity}
        options={SEVERITY_OPTIONS}
        onChange={handleFieldChange("severity")}
      />

      <button
        type="button"
        aria-pressed={value.contagiousOnly}
        onClick={toggleContagious}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
          value.contagiousOnly
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
        )}
      >
        <Biohazard className="h-4 w-4" aria-hidden="true" />
        Contagious Only
      </button>
    </div>
  );
}

export default DiseaseFilters;
