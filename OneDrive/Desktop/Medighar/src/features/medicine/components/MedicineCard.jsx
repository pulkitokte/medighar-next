import { useNavigate } from "react-router-dom";
import { ShieldCheck, Layers, Tag, Building2, Beaker } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Button from "@/shared/components/ui/Button.jsx";
import SaveButton from "@/shared/components/ui/SaveButton.jsx";

function MedicineCard({ medicine, className }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/medicines/${medicine.id}`);
  };

  return (
    <div
      className={cn(
        "relative flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition",
        "hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      <SaveButton
        type="medicine"
        id={medicine.id}
        className="absolute right-4 top-4"
      />

      <div className="flex items-start justify-between gap-3 pr-10">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            {medicine.name}
          </h3>
          <p className="truncate text-sm text-slate-500">
            {medicine.genericName}
          </p>
          <p className="text-sm font-medium text-blue-600">{medicine.brand}</p>
        </div>

        {medicine.prescriptionRequired && (
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50"
            title="Prescription required"
          >
            <ShieldCheck
              className="h-4 w-4 text-amber-600"
              aria-label="Prescription required"
            />
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <Tag className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          {medicine.category}
        </div>
        <div className="flex items-center gap-1.5">
          <Layers
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {medicine.dosageForm}
        </div>
        <div className="flex items-center gap-1.5">
          <Building2
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {medicine.manufacturer}
        </div>
        <div className="flex items-center gap-1.5">
          <Beaker
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {medicine.strength}
        </div>
      </div>

      <div className="mt-auto pt-2">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}

export default MedicineCard;
