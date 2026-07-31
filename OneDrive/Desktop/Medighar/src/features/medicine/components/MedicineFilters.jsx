import { ShieldCheck } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import FilterSelect from "@/shared/components/ui/FilterSelect.jsx";
import { MEDICINE_CATEGORIES } from "@/data/medicines/categories.js";
import { MEDICINES } from "@/data/medicines/medicines.js";

const DOSAGE_FORM_OPTIONS = [
  "All",
  ...new Set(MEDICINES.map((medicine) => medicine.dosageForm)),
];

function MedicineFilters({ value, onChange }) {
  const handleFieldChange = (field) => (fieldValue) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const togglePrescription = () => {
    onChange({ ...value, prescriptionOnly: !value.prescriptionOnly });
  };

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
      <FilterSelect
        label="Category"
        value={value.category}
        options={["All", ...MEDICINE_CATEGORIES]}
        onChange={handleFieldChange("category")}
      />
      <FilterSelect
        label="Dosage Form"
        value={value.dosageForm}
        options={DOSAGE_FORM_OPTIONS}
        onChange={handleFieldChange("dosageForm")}
      />

      <button
        type="button"
        aria-pressed={value.prescriptionOnly}
        onClick={togglePrescription}
        className={cn(
          "transition-premium inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600",
          value.prescriptionOnly
            ? "border-lime-200 bg-lime-100 text-lime-700"
            : "border-slate-200 bg-white text-slate-600 hover:border-lime-200 hover:bg-lime-50",
        )}
      >
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        Prescription Only
      </button>
    </div>
  );
}

export default MedicineFilters;
