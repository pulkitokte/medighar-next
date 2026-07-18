import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Button from "@/shared/components/ui/Button.jsx";
import { STATUS_LABELS } from "@/services/availability/availability.service.js";

const STATUS_CLASSES = {
  "in-stock": "bg-green-50 text-green-700",
  "limited-stock": "bg-amber-50 text-amber-700",
  "out-of-stock": "bg-red-50 text-red-700",
};

/**
 * Displays a medicine's mock stock indicator at a specific pharmacy (used
 * on the Pharmacy Details page's "Available Medicines" section). Distinct
 * from MedicineCard, which lists medicines generically without
 * pharmacy-specific stock context.
 * @param {{ medicine: object, status: string, stockLevel: number }} props
 */
function MedicineAvailabilityCard({ medicine, status, stockLevel }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {medicine.name}
          </h3>
          <p className="text-sm text-slate-500">{medicine.brand}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium",
            STATUS_CLASSES[status],
          )}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-slate-600">
        <Package
          className="h-4 w-4 shrink-0 text-slate-400"
          aria-hidden="true"
        />
        {status === "out-of-stock"
          ? "0 units in stock"
          : `${stockLevel} units in stock`}
      </div>

      <Button
        variant="outline"
        size="sm"
        fullWidth
        onClick={() => navigate(`/medicines/${medicine.id}`)}
      >
        View Medicine
      </Button>
    </div>
  );
}

export default MedicineAvailabilityCard;
