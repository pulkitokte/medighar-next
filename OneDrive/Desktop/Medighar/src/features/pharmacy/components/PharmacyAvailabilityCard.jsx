import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Phone } from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Button from "@/shared/components/ui/Button.jsx";
import { STATUS_LABELS } from "@/services/availability/availability.service.js";

const STATUS_CLASSES = {
  "in-stock": "bg-green-50 text-green-700",
  "limited-stock": "bg-amber-50 text-amber-700",
  "out-of-stock": "bg-red-50 text-red-700",
};

/**
 * Displays a pharmacy's mock availability for a specific medicine (used on
 * the Medicine Details page's "Available At Pharmacies" section). Distinct
 * from PharmacyCard, which lists pharmacies generically without
 * medicine-specific stock context.
 * @param {{ pharmacy: object, status: string, stockLevel: number, distanceKm: number }} props
 */
function PharmacyAvailabilityCard({
  pharmacy,
  status,
  stockLevel,
  distanceKm,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {pharmacy.name}
          </h3>
          <p className="text-sm text-slate-500">{pharmacy.type}</p>
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

      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <MapPin
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {distanceKm} km away
        </div>
        <div className="flex items-center gap-1.5">
          <Clock
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {pharmacy.open24Hours ? "Open 24/7" : pharmacy.timings}
        </div>
        <div className="flex items-center gap-1.5">
          <Phone
            className="h-4 w-4 shrink-0 text-slate-400"
            aria-hidden="true"
          />
          {pharmacy.phone}
        </div>
        <div className="flex items-center gap-1.5">
          {status === "out-of-stock" ? "0 units" : `${stockLevel} units`}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        fullWidth
        onClick={() => navigate(`/pharmacy/${pharmacy.id}`)}
      >
        View Pharmacy
      </Button>
    </div>
  );
}

export default PharmacyAvailabilityCard;
