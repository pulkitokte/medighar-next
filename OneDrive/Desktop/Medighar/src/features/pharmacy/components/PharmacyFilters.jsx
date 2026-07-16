import { Truck } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import FilterSelect from "@/shared/components/ui/FilterSelect.jsx";
import { PHARMACY_TYPES } from "@/data/pharmacy/services.js";
import { PHARMACIES } from "@/data/pharmacy/pharmacies.js";

const CITY_OPTIONS = [
  "All",
  ...new Set(PHARMACIES.map((pharmacy) => pharmacy.city)),
];

function PharmacyFilters({ value, onChange }) {
  const handleFieldChange = (field) => (fieldValue) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const toggleHomeDelivery = () => {
    onChange({ ...value, homeDeliveryOnly: !value.homeDeliveryOnly });
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
      <FilterSelect
        label="Type"
        value={value.type}
        options={["All", ...PHARMACY_TYPES]}
        onChange={handleFieldChange("type")}
      />
      <FilterSelect
        label="City"
        value={value.city}
        options={CITY_OPTIONS}
        onChange={handleFieldChange("city")}
      />

      <button
        type="button"
        aria-pressed={value.homeDeliveryOnly}
        onClick={toggleHomeDelivery}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
          value.homeDeliveryOnly
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
        )}
      >
        <Truck className="h-4 w-4" aria-hidden="true" />
        Home Delivery
      </button>
    </div>
  );
}

export default PharmacyFilters;
