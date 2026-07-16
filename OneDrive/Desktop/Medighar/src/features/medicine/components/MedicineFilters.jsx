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
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
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
          "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
          value.prescriptionOnly
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
        )}
      >
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        Prescription Only
      </button>
    </div>
  );
}

export default MedicineFilters;
