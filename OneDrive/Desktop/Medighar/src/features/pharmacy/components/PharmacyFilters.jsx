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
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
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
          "transition-premium inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600",
          value.homeDeliveryOnly
            ? "border-violet-200 bg-violet-100 text-violet-700"
            : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50",
        )}
      >
        <Truck className="h-4 w-4" aria-hidden="true" />
        Home Delivery
      </button>
    </div>
  );
}

export default PharmacyFilters;
