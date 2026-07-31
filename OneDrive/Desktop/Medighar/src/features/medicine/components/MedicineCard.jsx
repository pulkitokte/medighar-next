import { useNavigate } from "react-router-dom";
import { ShieldCheck, Layers, Tag, Building2, Beaker } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Button from "@/shared/components/ui/Button.jsx";
import SaveButton from "@/shared/components/ui/SaveButton.jsx";
import CompareButton from "@/features/medicine/components/CompareButton.jsx";

function MedicineCard({ medicine, className }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/medicines/${medicine.id}`);
  };

  return (
    <div
      className={cn(
        "card-surface card-surface-hover transition-premium relative flex h-full flex-col gap-5 border border-slate-100 bg-white p-6",
        "hover:-translate-y-1 hover:border-lime-200 hover:shadow-[0_20px_40px_-16px_rgba(15,23,42,0.14)]",
        className,
      )}
    >
      <SaveButton
        type="medicine"
        id={medicine.id}
        className="absolute right-5 top-5"
      />

      <div className="flex items-start gap-4 pr-10">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-100 to-lime-50 shadow-sm">
          <Beaker className="h-6 w-6 text-lime-700" aria-hidden="true" />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              {medicine.name}
            </h3>
            {medicine.prescriptionRequired && (
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700"
                title="Prescription required"
              >
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Rx
              </span>
            )}
          </div>
          <p className="truncate text-sm text-slate-500">
            {medicine.genericName}
          </p>
          <p className="text-sm font-medium text-lime-700">{medicine.brand}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-50 px-2.5 py-1 text-xs font-medium text-lime-700">
          <Tag className="h-3 w-3" aria-hidden="true" />
          {medicine.category}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
          <Layers className="h-3 w-3" aria-hidden="true" />
          {medicine.dosageForm}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
          {medicine.strength}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-slate-500">
        <Building2
          className="h-4 w-4 shrink-0 text-slate-400"
          aria-hidden="true"
        />
        {medicine.manufacturer}
      </div>

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        <CompareButton medicineId={medicine.id} />
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={handleViewDetails}
          className="rounded-full border-slate-200 hover:border-lime-200 hover:bg-lime-50"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}

export default MedicineCard;
